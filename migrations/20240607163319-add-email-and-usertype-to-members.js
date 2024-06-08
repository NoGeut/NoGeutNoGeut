'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Members', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });

    await queryInterface.addColumn('Members', 'userType', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'regular'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Members', 'email');
    await queryInterface.removeColumn('Members', 'userType');
  }
};
