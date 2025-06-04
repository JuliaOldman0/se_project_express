const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes");
const { createUser, login } = require("./controllers/users");
const { getItems } = require("./controllers/clothingItems"); 
const auth = require("./middlewares/auth");

const { PORT = 3001 } = process.env;

const app = express();

// DB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

// Middleware
app.use(cors()); 
app.use(express.json());

// ✨ Public routes
app.post("/signup", createUser);
app.post("/signin", login);
app.get("/items", getItems); 

// 🔐 Protect all other routes
app.use(auth);

// 🔒 Authenticated routes
app.use("/", mainRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
