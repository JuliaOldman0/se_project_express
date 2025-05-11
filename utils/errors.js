// Status codes
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const DEFAULT = 500;

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
    .status(DEFAULT)
    .send({ message: "An error has occurred on the server" });
};

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  handleError,
};
