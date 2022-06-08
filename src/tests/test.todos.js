const app = require("../index.js");
const request = require("supertest");
const mongoose = require("mongoose");
const TodoTask = require("../models/TodoTask.js");
const { createTodo } = require("./testUtils");

describe("Todo Tests", () => {
  // const app = makeExpressApp()

  beforeAll(async () => {
    // Clear test DB
    // assuing DB has been connected here
    await TodoTask.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  //getAll todo
  it("should get all todos", async () => {
    const res = await request(app).get("/api/v1/");
    expect(res.body.todos).toBeDefined();
    expect(res.body.todos).toHaveLength(0);

    await createTodo("test-all-todos");

    const res1 = await request(app).get("/api/v1/");
    expect(res1.body.todos).toBeDefined();
    expect(res1.body.todos).toHaveLength(1);
  });

  // patch todo
  it("should update the todo", async () => {
    const { todo } = await createTodo("update-this-todo");

    const res = await request(app).patch(`/api/v1/${todo._id}`).send({
      content: "updated-content",
    });
    expect(res.body.content).toBe("updated-content");

    const updatedTodo = await TodoTask.findById(todo._id);
    expect(updatedTodo.content).toBe("updated-content");
  });

  // delete todo
  it("should delete the todo", async () => {
    const { todo } = await createTodo("delete-this-todo");

    const res = await request(app).delete(`/api/v1/${todo._id}`);
    expect(res.body.todoTask.deletedCount).toBe(1);

    const todos = await TodoTask.find({ _id: todo._id });
    expect(todos).toHaveLength(0);
  });
});