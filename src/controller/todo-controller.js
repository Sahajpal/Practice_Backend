const TodoTask = require("../models/TodoTask");

async function getAllTodos(req, res) {
  res.json({
    todos: await TodoTask.find({}),
  });
}

async function createTodo(req, res) {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  res.json(await todoTask.save());
}

async function updateTodo(req, res) {
  const todoTaskId = req.params.id;
  let task = await TodoTask.updateOne(
    { _id: todoTaskId },
    {
      ...req.body,
    }
  );
  if (!task.matchedCount) {
    throw new RequestError(404, "No task found");
  }
  task = await TodoTask.findById(todoTaskId);
  res.json(task);
}

async function deleteTodo(req, res) {
  const id = req.params.id;
  const todoTask = await TodoTask.deleteOne({ _id: id });
  res.json({
    message: "Todo deleted successfully!",
    todoTask,
  });
}

module.exports = {
  createTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
};
