require("dotenv").config();
require("express-async-errors");
const fs = require("fs");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

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

// Get all TODOs
app.get("/", async (req, res) => {
  res.json({
    todos: await TodoTask.find({}),
  });
});

// Add new Todo
app.post("/", async (req, res, next) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  res.json(await todoTask.save());
});

// Edit a TODO

// Delete a TODO

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
    message: error.message || "An unknown error occurred!",
    err,
  });
});
