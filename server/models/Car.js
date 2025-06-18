const Car = (sequelize, DataTypes) => {
  const Car = sequelize.define("Car", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Car name is required
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false, // Model is required
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false, // Year is required
      validate: {
        min: 1900,      // Ensures year is realistic
        max: new Date().getFullYear() + 1, // Allows current/future year
      },
    },
    rentalPricePerDay: {
      type: DataTypes.DECIMAL(10, 2), // Stores prices like 99.99
      allowNull: false,
      validate: {
        min: 0, // Prevents negative prices
      },
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Defaults to 'true' if not provided
    },
  }, {
    timestamps: false,   // Disables createdAt/updatedAt
    tableName: 'cars',   // Explicit table name (optional)
    underscored: true,  // Uses snake_case in DB (e.g., rental_price_per_day)
  });

  Car.associate = (models) => {
    Car.hasMany(models.Rental, {
      foreignKey: 'carId',
      as: 'rentals'
    });
  };

  return Car;
};

export default Car;