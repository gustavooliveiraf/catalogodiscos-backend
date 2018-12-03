const Collection = require('../models').Collection;
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Collections', {
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
      description: {
        type: Sequelize.STRING
      },
      url: {
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
      Collection.create({
        name: 'Internacional',
        description: 'Discos internacionais, que marcaram gerações.',
        url: 'https://images.vexels.com/media/users/3/145816/isolated/preview/7616b64374d1ecc318e9d638807c4d61-logotipo-de-sinal-de-msica-rock-by-vexels.png'
      });

      Collection.create({
        name: 'Nacionais',
        description: 'Discos nacionais, que marcaram gerações.',
        url: 'https://st.depositphotos.com/1609126/3723/i/450/depositphotos_37238347-stock-photo-brazil-flag.jpg'
      });
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Collections');
  }
};