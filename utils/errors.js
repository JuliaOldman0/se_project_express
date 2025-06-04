// Status codes
const BAD_REQUEST = 400; // Invalid data from client
const UNAUTHORIZED = 401; // Missing or invalid auth
const FORBIDDEN = 403; // Authenticated but no permission
const NOT_FOUND = 404; // Resource not found
const CONFLICT = 409; // Duplicate data (e.g., email)
const INTERNAL_SERVER_ERROR = 500; // Generic server failure

// Centralized error handler
const handleError = (err, res) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(BAD_REQUEST).send({ message: err.message });
  }

  if (err.name === "CastError") {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }

  return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: "An error has occurred on the server" });
};

module.exports = {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  handleError,
};
