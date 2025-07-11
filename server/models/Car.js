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
    brand: {
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
      field: 'rental_price_per_day'
    },
    rating: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      defaultValue: 4.5,
      validate: {
        min: 0,
        max: 5,
      },
    },
    reviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
    fuelType: {
      type: DataTypes.ENUM('Petrol', 'Electric', 'Hybrid'),
      allowNull: false,
      field: 'fuel_type',
      defaultValue: 'Petrol',
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Downtown',
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    isLiked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_liked',
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_available',
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'https://via.placeholder.com/200x150?text=Car',
      field: 'image_url'
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
