const sharp = require('sharp');
const User = require('../models/user');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');

const getProfile = (req, res) => res.send(req.user);

const createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
};

const updateUser = async (req, res) => {
  const updateFields = Object.keys(req.body);
  const allowedFields = ['name', 'email', 'password', 'age'];
  const areValidFields = updateFields.every((update) =>
    allowedFields.includes(update)
  );
  if (!areValidFields)
    return res.status(400).send({ error: 'Invalid update fields' });

  try {
    updateFields.forEach((field) => {
      req.user[field] = req.body[field];
    });

    await req.user.save();

    const data = { user: req.user };

    if (updateFields.includes('password')) {
      req.user.tokens = [];
      data.token = await req.user.generateAuthToken();
    }

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (err) {
    res.status(500).send();
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send();
  }
};

const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
};

const logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
};

const getAvatar = async (req, res) => {
  try {
    if (!req.user.avatar) throw new Error('No avatar found');
    res.set('Content-Type', 'png');
    res.send(req.user.avatar);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const getUserAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) throw new Error('No avatar found');
    res.set('Content-Type', 'png');
    res.send(user.avatar);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const uploadAvatar = async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.send();
};

const deleteAvatar = async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send(req.user);
};

module.exports = {
  getProfile,
  createUser,
  updateUser,
  deleteUser,
  login,
  logout,
  logoutAll,
  getAvatar,
  getUserAvatar,
  uploadAvatar,
  deleteAvatar,
};
