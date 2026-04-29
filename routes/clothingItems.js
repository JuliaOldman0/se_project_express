const router = require("express").Router();

const {
  createClothingItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const {
  validateObjectId,
  validateCreateItem,
} = require("../middlewares/validation");

router.post("/", validateCreateItem, createClothingItem);
router.delete("/:itemId", validateObjectId, deleteItem);
router.put("/:itemId/likes", validateObjectId, likeItem);
router.delete("/:itemId/likes", validateObjectId, dislikeItem);

module.exports = router;
