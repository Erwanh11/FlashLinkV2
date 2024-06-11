const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerUser, loginUser } = require('../controllers/userController');
const app = express();

app.use(express.json());

app.post('/api/users/register', registerUser);
app.post('/api/users/login', loginUser);

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Controller', () => {
  describe('Register User', () => {
    it('should register a new user', async () => {
      bcrypt.hashSync.mockReturnValue('hashedPassword');
      jwt.sign.mockReturnValue('mockToken');

      const userData = { name: 'Test User', email: 'test@example.com', password: 'password' };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      expect(response.body.token).toBe('mockToken');
      const user = await User.findOne({ email: userData.email });
      expect(user).not.toBeNull();
      expect(user.name).toBe(userData.name);
    });

    it('should not register an existing user', async () => {
      const existingUser = new User({ name: 'Existing User', email: 'test@example.com', password: 'hashedPassword' });
      await existingUser.save();

      const userData = { name: 'Test User', email: 'test@example.com', password: 'password' };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('Login User', () => {
    it('should login an existing user', async () => {
      const hashedPassword = bcrypt.hashSync('password', 10);
      const user = new User({ name: 'Test User', email: 'test@example.com', password: hashedPassword });
      await user.save();

      bcrypt.compareSync.mockReturnValue(true);
      jwt.sign.mockReturnValue('mockToken');

      const loginData = { email: 'test@example.com', password: 'password' };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(200);

      expect(response.body.token).toBe('mockToken');
    });

    it('should not login with invalid credentials', async () => {
      const hashedPassword = bcrypt.hashSync('password', 10);
      const user = new User({ name: 'Test User', email: 'test@example.com', password: hashedPassword });
      await user.save();

      bcrypt.compareSync.mockReturnValue(false);

      const loginData = { email: 'test@example.com', password: 'wrongpassword' };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(400);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
