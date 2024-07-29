const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/userModel');

describe('User Endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should get user profile', async () => {
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('email', 'test@example.com');
  });
});
