module.exports = (sequelize, DataTypes) =>
    sequelize.define("product", {
      product_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      is_special: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      }
      
    }, {
      // Don't add the timestamp attributes (updatedAt, createdAt).
      timestamps: false
    });
  