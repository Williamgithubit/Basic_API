'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE TYPE "enum_cars_fuel_type" AS ENUM(\'Petrol\', \'Electric\', \'Hybrid\')');
    
    await queryInterface.addColumn('cars', 'brand', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Unknown'
    });

    await queryInterface.renameColumn('cars', 'rentalPricePerDay', 'rental_price_per_day');

    await queryInterface.addColumn('cars', 'rating', {
      type: Sequelize.DECIMAL(3, 1),
      allowNull: false,
      defaultValue: 4.5
    });

    await queryInterface.addColumn('cars', 'reviews', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('cars', 'seats', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5
    });

    await queryInterface.addColumn('cars', 'fuel_type', {
      type: 'enum_cars_fuel_type',
      allowNull: false,
      defaultValue: 'Petrol'
    });

    await queryInterface.addColumn('cars', 'location', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Downtown'
    });

    await queryInterface.addColumn('cars', 'features', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: []
    });

    await queryInterface.addColumn('cars', 'is_liked', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.renameColumn('cars', 'isAvailable', 'is_available');
    await queryInterface.renameColumn('cars', 'imageUrl', 'image_url');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('cars', 'brand');
    await queryInterface.renameColumn('cars', 'rental_price_per_day', 'rentalPricePerDay');
    await queryInterface.removeColumn('cars', 'rating');
    await queryInterface.removeColumn('cars', 'reviews');
    await queryInterface.removeColumn('cars', 'seats');
    await queryInterface.removeColumn('cars', 'fuel_type');
    await queryInterface.removeColumn('cars', 'location');
    await queryInterface.removeColumn('cars', 'features');
    await queryInterface.removeColumn('cars', 'is_liked');
    await queryInterface.renameColumn('cars', 'is_available', 'isAvailable');
    await queryInterface.renameColumn('cars', 'image_url', 'imageUrl');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_cars_fuel_type"');
  }
};
