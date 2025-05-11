const mongoose = require("mongoose");
const User = require("../models/user");
const { NOT_FOUND, handleError } = require("../utils/errors");

// Get all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => handleError(err, res));
};

// Create a new user
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => handleError(err, res));
};

// Get user by ID
const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      const err = new Error("User not found");
      err.name = "DocumentNotFoundError";
      throw err;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return handleError(err, res);
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
};
