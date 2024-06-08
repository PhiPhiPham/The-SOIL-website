module.exports = (express, app) => {
    const controller = require("../controllers/product.controller.js");
    const router = express.Router();
  
    // Select all products.
    router.get("/", controller.all);

    // Select one product
    router.get("/select/:id", controller.one);
  
    // Add routes to server.
    app.use("/api/products", router);
  };