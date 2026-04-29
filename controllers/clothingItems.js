const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/bad-request-error");
const ForbiddenError = require("../errors/forbidden-error");
const NotFoundError = require("../errors/not-found-error");

// Create a clothing item
const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }

      return next(err);
    });
};

// Get all items
const getItems = (req, res, next) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);

// Delete an item
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  return ClothingItem.findById(itemId)
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => {
      if (item.owner.toString() !== userId) {
        throw new ForbiddenError("You are not allowed to delete this item");
      }

      return item.deleteOne().then(() =>
        res.status(200).send({
          message: "Item successfully deleted",
          item,
        })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }

      return next(err);
    });
};

// Like an item
const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }

      return next(err);
    });
};

// Dislike an item
const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }

      return next(err);
    });
};

module.exports = {
  createClothingItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
