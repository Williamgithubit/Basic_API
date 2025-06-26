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
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1900,
        max: new Date().getFullYear() + 1,
      },
    },
    rentalPricePerDay: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'https://via.placeholder.com/200x150?text=Car',
      field: 'image_url' // THIS IS CRITICAL
    }
  }, {
    timestamps: false,
    tableName: 'cars',
    underscored: true
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
