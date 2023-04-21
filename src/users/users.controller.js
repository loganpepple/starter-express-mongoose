const User = require("./users.model");

async function list(req, res) {
  const users = await User.find();
  res.send(users);
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({
      status: 400,
      message: `Must include a ${propertyName}`,
    });
  };
}

async function create(req, res) {
  const { data: { username, email } = {} } = req.body;
  const newUser = new User({
    username: username,
    email: email,
  });
  await newUser.save();
  res.status(201).json({ data: newUser });
}

async function userExists(req, res, next) {
  const { userID } = req.params;
  const foundUser = await User.findOne({ _id: userId });
  if (foundUser) {
    res.locals.user = foundUser;
    return next();
  }
  next({
    status: 404,
    message: "User id not found: ${userId}",
  });
}

function read(req, res, next) {
  res.json({ data: res.locals.user });
}

async function update(re, res) {
  const user = res.locals.users;
  const { data: { username, email } = {} } = req.body;

  user.username = username;
  user.email = email;
  await user.save()

  res.json({ data: user });
}

async function destroy(req, res) {
  const { userId } = req.params;
  await User.deleteOne({ _id: userId });
  res.sendStatus(204);
}

module.exports = {
  list,
  create: [
    bodyDataHas("username"),
    bodyDataHas("email"),
    create
  ],
  update: [
    userExists,
    bodyDataHas("username"),
    bodyDataHas("email"),
    update
  ],
  read: [
    userExists,
    read
  ],
  delete: [
    userExists,
    destroy
  ],
  userExists
};
