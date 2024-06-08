const db = require("../database");

exports.add = async (req, res) => {
    const cart_id = req.body.cart_id;
    const product_id = req.body.product_id;
    let product = await db.cart_products.findOne({ where:{ product_id: product_id, cart_id: cart_id}});
  
    // Check if product is already in cart
    if (product == null) {
  
      // If not in cart, create the product in the cart with a value of 1
      product = await db.cart_products.create({
        quantity: 1,
        cart_id: cart_id,
        product_id: product_id
      });
  
    }else{
      console.log(product);
      // If in cart, increment the quantity of the product
      await product.increment('quantity');
    }
  
    res.json(product);
  }
  
  exports.subtract = async(req, res) => {
    const cart_id = req.body.cart_id;
    const product_id = req.body.product_id;
    const product = await db.cart_products.findOne({where:{ product_id: product_id, cart_id: cart_id}});
  
    // It's really funny that this syntax works
    if (product.quantity <= 1) product.destroy()
    else await product.decrement('quantity');
   
    res.json(product);
  };
  
  exports.delete = async(req,res) => {
    const cart_id = req.body.cart_id;
    const product_id = req.body.product_id;
    const product = await db.cart_products.findOne({ where:{ product_id: product_id, cart_id: cart_id}});
    if (product !== null) product.destroy();
    res.json(product);
  }

// Select all products in given cart id
exports.cartProducts = async(req, res) => {
    const cart_id = req.params.id;
    const cart_products = await db.cart_products.findAll({where:{cart_id: cart_id}});
    res.json(cart_products);
  }

// Join products and cart_products for given cart_id
exports.cartProductsJoin = async(req, res) => {
    const cart_id = req.params.id;

    const products = await db.cart_products.findAll({
        where: {
            cart_id: cart_id
        },
        include: [{
            model: db.product,
            attributes: ['product_id', 'name', 'price', 'is_special', 'image']
        }],
        attributes: ['quantity']
    })

    const result = products.map(product => {
        return ({
            product_id: product.product.product_id, // lol
            name: product.product.name,
            price: product.product.price,
            is_special: product.product.is_special,
            image: product.product.image,
            quantity: product.quantity
        })
    })

    return res.json(result);
}