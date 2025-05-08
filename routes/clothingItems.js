const router = require("express").Router();

const {
  createClothingItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.post("/", createClothingItem);
router.get("/", getItems);
router.put("/:itemId", updateItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
