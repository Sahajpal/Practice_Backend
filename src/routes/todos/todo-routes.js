const TodoTask = require("../../models/TodoTask");
const express = require("express");
const todoController = require("../../controller/todo-controller");

const router = new express.Router();

// Get all TODOs
router.get("/", todoController.getAllTodos);

// Add new Todo
router.post("/", todoController.createTodo);

// Edit a TODO
router.patch("/:id", todoController.updateTodo);

// Delete a TODO
router.delete("/:id", todoController.deleteTodo);

module.exports = router;
