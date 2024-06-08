module.exports = (express, app) => {
  const controller = require("../controllers/review.controller.js");
  const router = express.Router();

  //create new review
  router.post('/create', controller.create);

  //Update existing review
  router.post('/update', controller.update);

  // Delete Review
  router.post('/delete', controller.delete);

  // Select all reviews
  router.get('/all', controller.all)

  // Select all reviews of a certain product
  router.get('/select/:product_id', controller.select)

  app.use("/api/reviews", router);

};
