module.exports = (express, app) => {
    const controller = require("../controllers/cart.controller.js");
    const router = express.Router();
  
    // Select all carts.
    router.get("/", controller.all);

    // Select carts of given user_id.
    router.get("/select/:user_id", controller.select);

    // Create a new cart.
    router.post("/create", controller.create);

    // Add routes to server.
    app.use("/api/cart", router);
  };