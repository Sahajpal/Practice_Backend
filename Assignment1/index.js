require("dotenv").config();
require("express-async-errors");
const fs = require("fs");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const todoRoutes = require("./routes/todos/todo-routes");
const RequestError = require("./utils/RequestError");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("Connected to db!");

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server Up and running at ${process.env.PORT || 3000}`);
  });
});

// DRY principle -- Don't Repeat Yourself.
// Violation of DRY is -- WET: We enjoy typing, Write Everything twice etc.

app.use("/api/v1", todoRoutes);

// Unsupported Routes.
app.use((req, res, next) => {
  throw new RequestError(404, "Could not find this route.");
});

app.use((err, req, res, next) => {
  // TODO: use logging library -- Pino (Integrates well with AWS)
  console.log(err);
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      // TODO: Read about Sentry
      console.log(err);
    });
  }
  if (res.headersSent) {
    // Something terrible happened
    console.log("Headers were already sent!");
    return next(error); // crash node?
  }
  res.status(err.code || 500);
  res.json({
    status: "failed",
    message: err.message || "An unknown error occurred!",
    err,
  });
});
