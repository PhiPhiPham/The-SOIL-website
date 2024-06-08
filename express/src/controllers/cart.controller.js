const db = require("../database");

// Select all carts from the database.
exports.all = async (req, res) => {
    const items = await db.cart.findAll();
    res.json(items);
  };

// Select cart associated with given user_id
exports.select = async (req, res) => {
    const user_id = req.params.user_id;
    const cart = await db.cart.findAll({
        where:{
            user_id: user_id,
        },
    })
    res.json(cart);
  };

// Create a cart in the database for given userID.
exports.create = async (req, res) => {
    const userID = req.body.user_id;

    // Create the cart
    const cart = await db.cart.create({
      user_id: userID,
      active: true
    });
  
    res.json(cart);
  };
  