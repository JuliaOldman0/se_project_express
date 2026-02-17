const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  NOT_FOUND,
  CONFLICT,
  BAD_REQUEST,
  UNAUTHORIZED,
  handleError,
} = require("../utils/errors");

const SALT_ROUNDS = 10;

// Create a new user (sign up)
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required." });
  }

  return bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hashedPassword) =>
      User.create({
        name,
        avatar,
        email,
        password: hashedPassword,
      })
    )
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      return res.status(201).send(userData);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "Email already exists." });
      }
      return handleError(err, res);
    });
};

// Get current user from JWT payload
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  return User.findById(userId)
    .orFail(() => {
      const err = new Error("User not found");
      err.name = "DocumentNotFoundError";
      throw err;
    })
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      return res.status(200).send(userData);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return handleError(err, res);
    });
};

// Update user profile (name and avatar)
const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      const err = new Error("User not found");
      err.name = "DocumentNotFoundError";
      throw err;
    })
    .then((updatedUser) => {
      const userData = updatedUser.toObject();
      delete userData.password;
      return res.status(200).send(userData);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return handleError(err, res);
    });
};

// Login user (sign in)
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required." });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Incorrect email or password" });
      }
      return handleError(err, res);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  updateProfile,
  login,
};
