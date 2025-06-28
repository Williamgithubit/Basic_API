'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Customers', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'password123' // temporary default for existing records
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Customers', 'password');
  }
};
