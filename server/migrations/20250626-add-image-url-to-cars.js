'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('cars', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'https://via.placeholder.com/200x150?text=Car'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('cars', 'image_url');
  }
};
