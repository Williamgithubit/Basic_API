// client/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

// Import tokenStorage with type definition
interface TokenStorage {
  getToken: () => string | null;
  setToken: (token: string | null) => void;
  removeToken: () => void;
  hasToken: () => boolean;
  initializeFromStorage: () => boolean;
}

// Use dynamic import for tokenStorage
// @ts-ignore - Ignore the import error, we'll handle the type safety
import * as tokenStorageModule from '../utils/tokenStorage';
const tokenStorage = tokenStorageModule.default as TokenStorage;

interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'owner' | 'admin';
  phone?: string;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'owner';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize token from storage when component mounts
    tokenStorage.initializeFromStorage();
    
    const checkAuth = async () => {
      try {
        const token = tokenStorage.getToken();
        console.log('Token from storage:', token ? 'Token exists' : 'No token found');
        
        if (token) {
          try {
            console.log('Attempting to authenticate with API...');
            const response = await api.auth.getMe();
            console.log('Authentication successful');
            
            setUser({
              id: response.id,
              name: response.name,
              email: response.email,
              role: response.role,
              phone: response.phone,
            });
          } catch (apiError: any) {
            console.error('API Error during authentication check:', apiError);
            console.log('API Error details:', apiError.message);
            
            // Only logout for specific authentication errors
            const authErrorMessages = [
              'Invalid token', 'Token expired', 'jwt expired', 
              'jwt malformed', 'invalid signature', 'unauthorized'
            ];
            
            const isAuthError = authErrorMessages.some(msg => 
              apiError.message.toLowerCase().includes(msg.toLowerCase())
            );
            
            if (isAuthError) {
              console.log('Authentication error detected, logging out user');
              tokenStorage.removeToken();
              setUser(null);
            } else {
              // For other errors, keep the token and user logged in if possible
              console.log('Non-authentication API error, keeping user session if possible');
              
              // If we already have user data, don't clear it for non-auth errors
              if (user) {
                console.log('Keeping existing user session active');
              } else {
                // Try to recover the session from localStorage if possible
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                  try {
                    const parsedUser = JSON.parse(savedUser);
                    console.log('Recovered user session from localStorage');
                    setUser(parsedUser);
                  } catch (parseError) {
                    console.error('Failed to parse saved user data', parseError);
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed', error);
        // Only clear token for critical errors
        if (error instanceof Error && 
            (error.message.includes('token') || error.message.includes('auth') || error.message.includes('jwt'))) {
          tokenStorage.removeToken();
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Set up event listener for storage changes (in case token is modified in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        if (!e.newValue) {
          // Token was removed
          setUser(null);
          api.setAuthToken(null);
        } else if (e.newValue !== e.oldValue) {
          // Token was changed, re-authenticate
          checkAuth();
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });
      const { token, user } = response;
      
      // Store token using our utility
      tokenStorage.setToken(token);
      
      // Store user data in state and localStorage for recovery if needed
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      };
      
      setUser(userData);
      
      // Save user data to localStorage as backup
      try {
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (storageError) {
        console.warn('Could not save user data to localStorage', storageError);
      }
      
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const signup = async (data: SignupData): Promise<User> => {
    try {
      const response = await api.auth.signup(data);
      const { token, user } = response;
      
      // Store token using our utility
      tokenStorage.setToken(token);
      
      // Store user data in state and localStorage for recovery if needed
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      };
      
      setUser(userData);
      
      // Save user data to localStorage as backup
      try {
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (storageError) {
        console.warn('Could not save user data to localStorage', storageError);
      }
      
      return user;
    } catch (error) {
      console.error('Signup failed', error);
      throw error;
    }
  };

  const logout = () => {
    // Remove token using our utility
    tokenStorage.removeToken();
    
    // Clear user data from state and localStorage
    setUser(null);
    try {
      localStorage.removeItem('user');
    } catch (storageError) {
      console.warn('Could not remove user data from localStorage', storageError);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: user?.role === 'admin',
    isOwner: user?.role === 'owner',
    isCustomer: user?.role === 'customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
