'use strict';
module.exports = (sequelize, DataTypes) => {
  const CollectionDisc = sequelize.define('CollectionDisc', {
    discId: DataTypes.INTEGER,
    collectionId: DataTypes.INTEGER
  }, {});
  CollectionDisc.associate = function(models) {
    // associations can be defined here
  };
  return CollectionDisc;
};