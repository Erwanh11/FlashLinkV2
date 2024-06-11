const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/api/users', authRoutes);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({ name: 'Test User', email: 'testuser@example.com', password: 'password123' })
      .expect(201);

    expect(response.body.token).toBeDefined();
    const user = await User.findOne({ email: 'testuser@example.com' });
    expect(user).not.toBeNull();
  });

  it('should not register a user with an existing email', async () => {
    await request(app)
      .post('/api/users/register')
      .send({ name: 'Test User', email: 'testuser@example.com', password: 'password123' });

    const response = await request(app)
      .post('/api/users/register')
      .send({ name: 'Another User', email: 'testuser@example.com', password: 'password123' })
      .expect(400);

    expect(response.body.message).toBe('User already exists');
  });

  it('should login a user with valid credentials', async () => {
    await request(app)
      .post('/api/users/register')
      .send({ name: 'Test User', email: 'testuser@example.com', password: 'password123' });

    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'testuser@example.com', password: 'password123' })
      .expect(200);

    expect(response.body.token).toBeDefined();
  });

  it('should not login a user with invalid credentials', async () => {
    await request(app)
      .post('/api/users/register')
      .send({ name: 'Test User', email: 'testuser@example.com', password: 'password123' });

    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'testuser@example.com', password: 'wrongpassword' })
      .expect(400);

    expect(response.body.message).toBe('Invalid credentials');
  });
});
