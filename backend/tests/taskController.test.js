const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const app = express();

app.use(express.json());

app.get('/api/tasks', getTasks);
app.post('/api/tasks', createTask);
app.put('/api/tasks/:id', updateTask);
app.delete('/api/tasks/:id', deleteTask);

// Mock User ID for requests
const userId = new mongoose.Types.ObjectId();
const mockUser = { id: userId.toString(), email: 'test@example.com' };

// Mock auth middleware to inject user into request
const authMiddleware = (req, res, next) => {
  req.user = mockUser;
  next();
};

app.use(authMiddleware);


beforeEach(async () => {
  await Task.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Task Controller', () => {
  it('should fetch tasks for a user', async () => {
    await Task.create({ user: userId, title: 'Task 1', description: 'Description 1', priority: 'medium' });

    const response = await request(app)
      .get('/api/tasks')
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe('Task 1');
  });

  it('should create a new task and send email', async () => {
    const taskData = { title: 'New Task', description: 'New Description', priority: 'high' };

    const response = await request(app)
      .post('/api/tasks')
      .send(taskData)
      .expect(201);

    expect(response.body.title).toBe(taskData.title);
    expect(sendMailMock).toHaveBeenCalled();
  });

  it('should update an existing task', async () => {
    const task = await Task.create({ user: userId, title: 'Old Task', description: 'Old Description', priority: 'low' });
    const updatedData = { title: 'Updated Task', description: 'Updated Description', priority: 'medium' };

    const response = await request(app)
      .put(`/api/tasks/${task._id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.title).toBe(updatedData.title);
    expect(response.body.description).toBe(updatedData.description);
    expect(response.body.priority).toBe(updatedData.priority);
  });

  it('should delete an existing task', async () => {
    const task = await Task.create({ user: userId, title: 'Task to delete', description: 'Description to delete', priority: 'low' });

    await request(app)
      .delete(`/api/tasks/${task._id}`)
      .expect(200);

    const foundTask = await Task.findById(task._id);
    expect(foundTask).toBeNull();
  });
});
