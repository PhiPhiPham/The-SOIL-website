module.exports = (sequelize, DataTypes) =>
    sequelize.define("cart", {
      cart_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
      
    }, {
      // Don't add the timestamp attributes (updatedAt, createdAt).
      timestamps: false
    });
  