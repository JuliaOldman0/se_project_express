# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. This project helps users manage their wardrobe items and determine what to wear based on the weather. You'll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with a RESTful API and user authorization.

## ✨ Project Functionality

- Users can:
  - View a collection of clothing items.
  - Add a new item (with name, image URL, and weather suitability).
  - Like or dislike items.
  - Delete items they own.

## 🧰 Technologies and Techniques Used

- **Node.js** & **Express.js** – backend server and routing
- **MongoDB** & **Mongoose** – database and object modeling
- **ESLint** – code linting using Airbnb + Prettier config
- **REST API** – standardized API structure
- **Middleware** – for centralized error handling and mock authorization
- **Environment-based configuration** – using `process.env`

## 🚀 Running the Project

```bash
npm run start     # launches the server
npm run dev       # launches the server with hot reload (via nodemon)
