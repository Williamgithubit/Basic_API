const Rental = (sequelize, DataTypes) => {
  const Rental = sequelize.define("Rental", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    carId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cars',  // References the 'cars' table
        key: 'id',      // References the 'id' column in 'cars'
      },
      onDelete: 'CASCADE', // Optional: Delete rental if car is deleted
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers', // References the 'customers' table
        key: 'id',
      },
      onDelete: 'CASCADE', // Optional: Delete rental if customer is deleted
    },
    startDate: {
      type: DataTypes.DATEONLY, // Stores date without time (e.g., '2025-06-20')
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString().split('T')[0], // Future date
      },
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterStartDate(value) { // Custom validator
          if (value <= this.startDate) {
            throw new Error('End date must be after start date.');
          }
        },
      },
    },
    totalCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: 'rentals',
    underscored: true
  });

  Rental.associate = (models) => {
    Rental.belongsTo(models.Car, {
      foreignKey: 'carId',
      as: 'Car'
    });
    Rental.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'Customer'
    });
  };

  return Rental;
};

export default Rental;