const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Task = require('../models/Task');
const taskRoutes = require('../routes/taskRoutes');

const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
});

afterEach(async () => {
  await Task.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Task API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = new User({ name: 'Test User', email: 'testuser@example.com', password: 'password123' });
    await user.save();
    userId = user._id;
    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  it('should create a new task', async () => {
    const taskData = { title: 'New Task', description: 'New Description', priority: 'high' };

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(taskData)
      .expect(201);

    expect(response.body.title).toBe(taskData.title);
    const task = await Task.findOne({ title: 'New Task' });
    expect(task).not.toBeNull();
  });

  it('should fetch tasks for a user', async () => {
    await Task.create({ user: userId, title: 'Task 1', description: 'Description 1', priority: 'medium' });

    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe('Task 1');
  });

  it('should update an existing task', async () => {
    const task = await Task.create({ user: userId, title: 'Old Task', description: 'Old Description', priority: 'low' });
    const updatedData = { title: 'Updated Task', description: 'Updated Description', priority: 'medium' };

    const response = await request(app)
      .put(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const foundTask = await Task.findById(task._id);
    expect(foundTask).toBeNull();
  });

  it('should deny access to tasks without token', async () => {
    await request(app)
      .get('/api/tasks')
      .expect(401);
  });

  it('should deny access to tasks with invalid token', async () => {
    await request(app)
      .get('/api/tasks')
      .set('Authorization', 'Bearer invalidToken')
      .expect(401);
  });
});
