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
    phone: {
      type: DataTypes.STRING,
      allowNull: false, // Phone is required
      validate: {
        // Simple phone number validation (adjust regex as needed)
        is: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
      },
    },
  }, {
    timestamps: false,  // Disables createdAt/updatedAt fields
    tableName: 'customers', // Explicit table name (optional)
    underscored: true,  // Uses snake_case in DB (e.g., 'phone_number' if field was phoneNumber)
    hooks: {
      beforeCreate: async (customer) => {
        if (customer.password) {
          customer.password = await bcrypt.hash(customer.password, 10);
        }
      },
      beforeUpdate: async (customer) => {
        if (customer.changed('password')) {
          customer.password = await bcrypt.hash(customer.password, 10);
        }
      }
    }
  });

  Customer.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password);
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