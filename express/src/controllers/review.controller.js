const db = require("../database");
const Review = db.Review; 

exports.all = async (req,res) => {
  const reviews = await db.review.findAll();
  res.json(reviews);
}

exports.select = async (req,res) => {
  const reviews = await db.review.findAll({where: {product_id: req.params.product_id}});
  res.json(reviews);
}

exports.create = async (req, res) => {
  const review = await db.review.create({
    user_id: req.body.user_id,
    product_id: req.body.product_id,
    text: req.body.text,
    stars: req.body.stars
  });
  res.json(review);
  
}

exports.update = async (req, res) => {
  const review = await db.review.findByPk(req.body.review_id);
  review.set({
    text: req.body.text,
    stars: req.body.stars
  })
  await review.save();
  res.json(review);
}

exports.delete = async (req, res) => {
  const review_id = req.body.review_id;
  console.log(review_id);
  const review = await db.review.findByPk(review_id);
  if (review !== null) review.destroy();
  res.json(review);
}