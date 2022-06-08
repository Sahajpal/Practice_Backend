require("dotenv").config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });
require("express-async-errors");
const fs = require("fs");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const logger = require("./utils/logger");

const todoRoutes = require("./routes/todos/todo-routes");
const RequestError = require("./utils/RequestError");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  logger.info("Connected to db!");

  if (process.env.NODE_ENV !== "test") {
    app.listen(process.env.PORT || 3000, () => {
      logger.info(`Server Up and running at ${process.env.PORT || 3000}`);
    });
  } else {
    logger.warn("Warning: running in test mode");
  }
});

// DRY principle -- Don't Repeat Yourself.
// Violation of DRY is -- WET: We enjoy typing, Write Everything twice etc.

app.use("/api/v1", todoRoutes);

// Unsupported Routes.
app.use((req, res, next) => {
  throw new RequestError(404, "Could not find this route.");
});

//Error Handler
app.use((err, req, res, next) => {
  // TODO: use logging library -- Pino (Integrates well with AWS)
  logger.error(err);
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      // TODO: Read about Sentry
      logger.error(err);
    });
  }
  if (res.headersSent) {
    // Something terrible happened
    logger.warn("Headers were already sent!");
    return next(error); // crash node?
  }
  res.status(err.code || 500);

  res.json({
    status: "failed",
    message: err.message || "An unknown error occurred!",
    err,
  });
});

module.exports = app;
