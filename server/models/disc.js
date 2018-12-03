'use strict';
module.exports = (sequelize, DataTypes) => {
  const Disc = sequelize.define('Disc', {
    name: DataTypes.STRING,
  }, {});
  Disc.associate = function(models) {
    // associations can be defined here
  };
  return Disc;
};