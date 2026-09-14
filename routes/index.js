const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

const { createUser, login } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");

const auth = require("../middlewares/auth");

const {
  validateCreateUser,
  validateLogin,
} = require("../middlewares/validation");

const { NotFoundError } = require("../utils/errors");

// Public routes
router.post("/users", validateCreateUser, createUser);
router.post("/signin", validateLogin, login);
router.get("/items", getItems);

// Protect everything below this line
router.use(auth);

// Authenticated routes
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

// 404 fallback
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
