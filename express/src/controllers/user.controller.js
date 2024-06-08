const db = require("../database");
const argon2 = require("argon2");

// Select all users from the database.
exports.all = async (req, res) => {
  const users = await db.user.findAll();
    // commented code is to add carts.
    // {include: { model: db.cart, as: "carts"}}
  res.json(users);
};

// Select one user from the database.
exports.one = async (req, res) => {
  const user = await db.user.findByPk(req.params.id);

  res.json(user);
};

// Select one user from the database if email and password are a match.
exports.login = async (req, res) => {
  const user = await db.user.findOne({
    where: {
      email: req.query.email,
    },
  });

  if(user === null || await argon2.verify(user.password_hash, req.query.password) === false)
    // Login failed.
    res.json(null);
  else
    res.json(user);
};

exports.verifyEmail = async (req, res) => {
  const user = await db.user.findOne({
    where: {
      email: req.params.email,
    },
  });

  if(user === null)
    // User not found - true
    res.json(true);
  else
    res.json(false);

}

exports.verifyUsername = async (req, res) => {
  const user = await db.user.findOne({
    where: {
      username: req.params.username,
    },
  });

  if(user === null)
    // User not found - true
    res.json(true);
  else
    res.json(false);
}


// Create a user in the database.
exports.create = async (req, res) => {
  // checking password
  const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/><.,`\[\]\\\-]).{8,}$/;

  if (!strongPasswordRegex.test(req.body.password))
    return res.status(400).json({ password: 'API Control: Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be at least 8 characters long.' });

  const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });
  
  const user = await db.user.create({
    email: req.body.email,
    username: req.body.username,
    password_hash: hash,
    dateCreated: new Date().toISOString().split("T")[0]
  });
  res.json(user);
};

exports.deleteUser = async(req, res) => {
  await db.user.destroy({
    where: {
      user_id: req.query.id,
    },
  });
  res.json(null);
}

exports.updateEmail = async (req, res) => {
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({ email: 'API Control: Please enter an email in the correct format' });
  }

  const user = await db.user.update(
    { email: req.body.email },
    {
      where: {
        user_id: req.body.id,
      },
    },
  );
  res.json(user);
};

exports.updatePassword = async (req, res) => {
  // checking password
  const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/><.,`\[\]\\\-]).{8,}$/;

  if (!strongPasswordRegex.test(req.body.password)) {
    return res.status(400).json({ password: 'API Control: Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be at least 8 characters long.' });
  }

  const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });
  const user = await db.user.update(
    { password_hash: hash },
    {
      where: {
        user_id: req.body.id,
      },
    },
  );

  res.json(user);
};