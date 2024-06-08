const db = require("../database");

// Select all prodcuts from the database.
exports.all = async (req, res) => {
    const products = await db.product.findAll();
    res.json(products);
  };

exports.one = async (req, res) => {
  const product = await db.product.findOne({where:{product_id: req.params.id}});
  res.json(product);
}