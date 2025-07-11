import bcrypt from 'bcryptjs';

const Customer = (sequelize, DataTypes) => {
  const Customer = sequelize.define("Customer", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Name is required
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, // Email is required
      unique: true,     // Ensures email is unique
      validate: {
        isEmail: true, // Validates email format (e.g., 'test@example.com')
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true, // Phone is optional now
      validate: {
        // Simple phone number validation (adjust regex as needed)
        is: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
      },
    },
    // Added role field for access control
    role: {
      type: DataTypes.ENUM('customer', 'owner', 'admin'),
      allowNull: false,
      defaultValue: 'customer',
      validate: {
        isIn: [['customer', 'owner', 'admin']],
      }
    },
    // Added isActive field for account status
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    // Optional avatar/profile image URL
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // Added last login timestamp
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // Added optional address information
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    timestamps: true,  // Enables createdAt/updatedAt fields
    tableName: 'customers', // Explicit table name (optional)
    underscored: true,  // Uses snake_case in DB (e.g., 'phone_number' if field was phoneNumber)
    hooks: {
      beforeCreate: async (customer) => {
        if (customer.password) {
          customer.password = await bcrypt.hash(customer.password, 10);
        }
        // Set default role if not specified
        if (!customer.role) {
          customer.role = 'customer';
        }
      },
      beforeUpdate: async (customer) => {
        if (customer.changed('password')) {
          customer.password = await bcrypt.hash(customer.password, 10);
        }
      }
    }
  });

  // Instance methods
  Customer.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };

  // Check if user has specific role
  Customer.prototype.hasRole = function(role) {
    return this.role === role;
  };

  // Check if user has permission to access dashboard
  Customer.prototype.canAccessDashboard = function() {
    return this.isActive && (this.role === 'admin' || this.role === 'owner');
  };

  // Check if user can manage other users (admin only)
  Customer.prototype.canManageUsers = function() {
    return this.isActive && this.role === 'admin';
  };

  Customer.associate = (models) => {
    Customer.hasMany(models.Rental, {
      foreignKey: 'customerId',
      as: 'rentals'
    });
  };

  return Customer;
};

export default Customer;