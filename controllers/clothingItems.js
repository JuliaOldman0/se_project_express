const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

// Common error handler
const handleError = (err, res) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(BAD_REQUEST).send({ message: err.message });
  }

  if (err.name === "CastError") {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }

  return res
    .status(DEFAULT)
    .send({ message: "An error has occurred on the server" });
};

// Create a clothing item
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => handleError(err, res));
};

// Get all items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => handleError(err, res));
};

// Delete an item
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const err = new Error("Item not found");
      err.name = "DocumentNotFoundError";
      throw err;
    })
    .then((deletedItem) =>
      res.status(200).send({
        message: "Item successfully deleted",
        item: deletedItem,
      })
    )
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return handleError(err, res);
    });
};

// Like an item
const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      const err = new Error("Item not found");
      err.name = "DocumentNotFoundError";
      throw err;
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return handleError(err, res);
    });
};

// Dislike an item
const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      const err = new Error("Item not found");
      err.name = "DocumentNotFoundError";
      throw err;
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return handleError(err, res);
    });
};

module.exports = {
  createClothingItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
