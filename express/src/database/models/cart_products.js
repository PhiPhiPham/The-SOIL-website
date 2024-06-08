module.exports = (sequelize, DataTypes) =>
    sequelize.define("cart_products", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
        
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
      
    }, {
      // Don't add the timestamp attributes (updatedAt, createdAt).
      timestamps: false
    });
  