const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
  Op: Sequelize.Op
};

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT
});

// Include models.
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.cart = require("./models/cart.js")(db.sequelize, DataTypes);
db.product = require("./models/product.js")(db.sequelize, DataTypes);
db.review = require("./models/review.js")(db.sequelize, DataTypes);
db.cart_products = require("./models/cart_products.js")(db.sequelize, DataTypes);

// Setup Primary-Foreign key relationships

db.user.hasMany(db.review, { foreignKey: { name: "user_id" } });
db.review.belongsTo(db.user, { foreignKey: { name: "user_id", allowNull: false } });

db.user.hasOne(db.cart, { foreignKey: { name: "user_id"} });
db.cart.belongsTo(db.user, { foreignKey: { name: "user_id", allowNull: false } });

db.cart.hasMany(db.cart_products, { foreignKey: { name: "cart_id"}});
db.cart_products.belongsTo(db.cart, { foreignKey: { name: "cart_id", allowNull: false}});

db.product.hasMany(db.cart_products, { foreignKey: { name: "product_id"}});
db.cart_products.belongsTo(db.product, { foreignKey: { name: "product_id", allowNull: false}});

db.product.hasMany(db.review, { foreignKey: { name: "product_id" } });
db.review.belongsTo(db.product, { foreignKey: { name: "product_id", allowNull: false } });


// Learn more about associations here: https://sequelize.org/master/manual/assocs.html

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  await db.sequelize.sync();

  // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
  //await db.sequelize.sync({ force: true });
  
  await seedData();
};

async function seedData() {
  const count = await db.user.count();

  // Only seed data if necessary.
  if(count > 0)
    return;

  const argon2 = require("argon2");

  //Hard coded users
  let hash = await argon2.hash("abc123", { type: argon2.argon2id });
  await db.user.create({username: "mbolger", password_hash: hash, email: "abc@gmail.com", dateCreated: new Date().toISOString().split("T")[0] });

  hash = await argon2.hash("def456", { type: argon2.argon2id });
  await db.user.create({username: "shekhar", password_hash: hash, email: "shek@gmail.com", dateCreated: new Date().toISOString().split("T")[0]});

  //Hard coded products 
  await db.product.create({name: "Apple Crumble", price: 8.99, is_special: false, image: "../apple_crumble.jpg"});
  await db.product.create({name: "Apples", price: 2.49, is_special: false, image: "../apples.jpg"});
  await db.product.create({name: "Bread", price: 3.99, is_special: true, image: "../bread.jpg"});
  await db.product.create({name: "Butter", price: 4.99, is_special: false, image: "../butter.jpg"});
  await db.product.create({name: "Cheese Board", price: 14.99, is_special: false, image: "../cheese_board.jpg"});
  await db.product.create({name: "Coffee Beans", price: 9.99, is_special: true, image: "../coffee_beans.jpg"});
  await db.product.create({name: "Dozen Eggs", price: 7.99, is_special: true, image: "../eggs.jpg"});
  await db.product.create({name: "Milk", price: 3.49, is_special: true, image: "../milk.jpg"})
  await db.product.create({name: "Oranges", price: 2.49, is_special: false, image: "../oranges.jpg"})
}

module.exports = db;
