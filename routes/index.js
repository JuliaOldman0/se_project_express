const router = require("express").Router();
const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to the API" });
});

module.exports = router;
