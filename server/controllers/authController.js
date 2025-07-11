import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Secret key for JWT token generation - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// JWT Secret and authentication functions

// Register a new user
export const register = async (req, res) => {
  const { name, email, password, phone, role = 'customer' } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await db.Customer.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user with specified role (default to customer if not specified)
    // Only allow admin creation if request is from an existing admin
    let userRole = role;
    
    // Restrict role creation - only restrict 'admin' role creation
    if (role === 'admin') {
      // Check if request has a valid admin token
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        userRole = 'customer'; // Default to customer if no token
      } else {
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          const requestingUser = await db.Customer.findByPk(decoded.id);
          
          // Only allow admin creation if requesting user is an admin
          if (!requestingUser || requestingUser.role !== 'admin') {
            userRole = 'customer';
          }
        } catch (error) {
          userRole = 'customer';
        }
      }
    }
    
    // Allow 'owner' role during signup - no restrictions
    
    // Create the new user with hashed password
    const newUser = await db.Customer.create({
      name,
      email,
      password, // Will be hashed in the model's beforeCreate hook
      phone,
      role: userRole,
      isActive: true,
      lastLogin: new Date()
    });
    
    // Create token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return user data (excluding password) and token
    const userData = newUser.toJSON();
    delete userData.password;
    
    return res.status(201).json({
      message: 'User registered successfully',
      user: userData,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // First check Customer model (where users are registered)
    let user = await db.Customer.findOne({ where: { email } });
    
    // If not found in Customer model, check User model as fallback
    if (!user) {
      user = await db.User.findOne({ where: { email } });
      
      // If user not found in either model
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }
    
    // Check if user is active (if the field exists)
    if (user.isActive === false) {
      return res.status(401).json({ message: 'Account is deactivated. Please contact support.' });
    }
    
    // Check password - handle both password validation methods
    let isPasswordValid = false;
    
    if (typeof user.validatePassword === 'function') {
      // If the model has a validatePassword method (Customer model)
      isPasswordValid = await user.validatePassword(password);
    } else if (typeof user.validPassword === 'function') {
      // If the model has a validPassword method (User model)
      isPasswordValid = await user.validPassword(password);
    } else {
      // Otherwise compare with bcrypt directly
      isPasswordValid = await bcrypt.compare(password, user.password);
    }
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Update last login time if the field exists
    if ('lastLogin' in user) {
      await user.update({ lastLogin: new Date() });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return user data (excluding password) and token
    const userData = user.toJSON();
    delete userData.password;
    
    return res.status(200).json({
      message: 'Login successful',
      user: userData,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    // User ID comes from the authenticated middleware
    const userId = req.userId;
    
    // Try to find user in User model first (for admin users)
    let user = await db.User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    // If not found in User model, try Customer model
    if (!user) {
      user = await db.Customer.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify that the user exists in either User or Customer model
    let userExists = false;
    
    // Check User model first (for admin users)
    const adminUser = await db.User.findByPk(decoded.id);
    if (adminUser) {
      userExists = true;
    } else {
      // If not found in User model, check Customer model
      const customerUser = await db.Customer.findByPk(decoded.id);
      if (customerUser) {
        userExists = true;
      }
    }
    
    if (!userExists) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Add user ID to request for use in route handlers
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Role-based access control middleware
export const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  
  return (req, res, next) => {
    if (!req.userId || !req.userRole) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (roles.length && !roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
    }
    
    next();
  };
};

// Check if user can access dashboard
export const checkDashboardAccess = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Try to find user in User model first (for admin users)
    let user = await db.User.findByPk(userId);
    let isAdmin = false;
    
    // If found in User model, it's an admin user
    if (user) {
      isAdmin = user.role === 'admin';
    } else {
      // If not found in User model, try Customer model
      user = await db.Customer.findByPk(userId);
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // For admin users, always grant access
    const canAccess = isAdmin || (typeof user.canAccessDashboard === 'function' ? user.canAccessDashboard() : user.role === 'owner');
    
    return res.status(200).json({
      canAccess,
      dashboardType: isAdmin ? 'admin' : (user.role === 'owner' ? 'owner' : 'customer'),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Dashboard access check error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Reset password request
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await db.Customer.findOne({ where: { email } });
    if (!user) {
      // For security, don't reveal that the email doesn't exist
      return res.status(200).json({ message: 'If your email exists in our system, you will receive a password reset link' });
    }
    
    // In a real application, you would:
    // 1. Generate a secure token
    // 2. Store it in the database with an expiration
    // 3. Send an email with a reset link
    
    // For this example, we'll just acknowledge the request
    return res.status(200).json({ message: 'If your email exists in our system, you will receive a password reset link' });
  } catch (error) {
    console.error('Password reset request error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update user's own profile
export const updateProfile = async (req, res) => {
  const { name, phone, address, currentPassword, newPassword } = req.body;
  const userId = req.userId;
  
  try {
    const user = await db.Customer.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create update object with allowed fields
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;
    
    // If password change is requested, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      
      const isPasswordValid = await user.validatePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      
      updates.password = newPassword; // Will be hashed in the beforeUpdate hook
    }
    
    // Update user profile
    await user.update(updates);
    
    // Return updated user data (excluding password)
    const userData = user.toJSON();
    delete userData.password;
    
    return res.status(200).json({
      message: 'Profile updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};