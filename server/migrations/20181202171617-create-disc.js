const Disc = require('../models').Disc;
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Discs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(function () {
      Disc.create({
        name: 'The Beatles'
      });

      Disc.create({
        name: 'Roberto Carlos'
      });
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Discs');
  }
};