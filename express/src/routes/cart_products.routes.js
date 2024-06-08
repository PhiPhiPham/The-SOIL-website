module.exports = (express, app) => {
    const controller = require("../controllers/cart_products.controller.js");
    const router = express.Router();

     // Add to cart
     router.post("/add", controller.add);

     // Delete from cart
     router.post("/delete", controller.delete);
 
     // Subtract from cart
     router.post("/subtract", controller.subtract);
  
    // Select all products for given cart_id.
    router.get("/select/:id", controller.cartProducts);

    // Join products onto cart_products for given cart_id
    router.get("/join/:id", controller.cartProductsJoin);

    // Add routes to server.
    app.use("/api/cart_products", router);
}