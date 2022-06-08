const TodoTask = require("../models/TodoTask")

const createTodo = async (content) => {
    const todoTask = new TodoTask({
        content: content ?? "test-todo",
    });

    const tmp = await todoTask.save();

    const todo = await TodoTask.findById(tmp._id)
    expect(todo.content).toBeDefined();
    expect(todo.content).toBe(content ?? "test-todo");

    return { todo, content: todoTask.content }
}

module.exports = {
    createTodo
}