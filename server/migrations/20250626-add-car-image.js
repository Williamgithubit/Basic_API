'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Cars', 'imageUrl', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'https://via.placeholder.com/400x300?text=No+Image+Available'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Cars', 'imageUrl');
  }
};
