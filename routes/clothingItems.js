const router = require("express").Router();

const {
  createClothingItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.post("/", createClothingItem);
router.get("/", getItems);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
