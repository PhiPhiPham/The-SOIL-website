module.exports = (express, app) => {
  const controller = require("../controllers/user.controller.js");
  const router = express.Router();

  // Select all users.
  router.get("/", controller.all);

  // Select a single user with id.
  router.get("/select/:id", controller.one);

  // Select one user from the database if username and password are a match.
  router.get("/login", controller.login);

  // Create a new user.
  router.post("/", controller.create);

  // Delete user
  router.delete("/", controller.deleteUser);

  // Verifying email
  router.get("/verifyEmail/:email", controller.verifyEmail);

  // Verifying Username
  router.get("/verifyUsername/:username", controller.verifyUsername);

  // Updating email
  router.put("/update/email", controller.updateEmail);

  // Updating password
  router.put("/update/password", controller.updatePassword);

  // Add routes to server.
  app.use("/api/users", router);
};
