export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('customers', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'changeme' // temporary default value for existing records
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('customers', 'password');
  }
};
