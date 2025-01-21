  import request from 'supertest';
  import mongoose from 'mongoose';
  import { MongoMemoryServer } from 'mongodb-memory-server';
  import app from '../../app';
  import { User } from '../../models/User';
  import { hashHelper } from '../../utils/hashHelper';

  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Start MongoMemoryServer
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Check if Mongoose is already connected
    if (mongoose.connection.readyState === 0) {
      // Connect to the in-memory database
      await mongoose.connect(uri, {
      });
    }
  });

  afterEach(async () => {
    // Clear all collections after each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    // Disconnect and stop the MongoMemoryServer
    await mongoose.connection.dropDatabase(); // Ensure the database is cleaned up
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe('Auth Controller', () => {
    describe('POST /register', () => {
      it('should register a new user successfully', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          username: 'testUser',
        };

        const response = await request(app)
          .post('/api/auth/register') // Assuming this is the route for user registration
          .send(userData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.email).toBe(userData.email);
        expect(response.body.data.username).toBe(userData.username);

        // Ensure the user was saved in the database
        const userInDb = await User.findOne({ email: userData.email });
        expect(userInDb).not.toBeNull();
        expect(userInDb?.email).toBe(userData.email);
      });

      it('should return 400 if email is already registered', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          username: 'testUser',
        };

        // Create a user
        await User.create({
          email: userData.email,
          password: userData.password,
          username: userData.username,
        });

        // Try registering with the same email
        const response = await request(app)
          .post('/api/auth/register')
          .send(userData);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Email is already registered');
      });
    });

    describe('POST /login', () => {
      it('should log in an existing user successfully', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          username: 'testUser',
        };

        // Create a user
        const hashedPassword = await hashHelper.hashPassword(userData.password); // Assuming hashPassword exists
        await User.create({
          email: userData.email,
          password: hashedPassword,
          username: userData.username,
        });

        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: userData.password,
          });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
      });

      it('should return 404 for non-existing user', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'nonexistent@example.com',
            password: 'password123',
          });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid credentials');
      });

      it('should return 401 for incorrect password', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          username: 'testUser',
        };

        // Create a user
        const hashedPassword = await hashHelper.hashPassword(userData.password); // Assuming hashPassword exists
        await User.create({
          email: userData.email,
          password: hashedPassword,
          username: userData.username,
        });

        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: 'wrongpassword',
          });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid credentials');
      });
    });

    describe('POST /logout', () => {
      it('should log out the user successfully', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          username: 'testUser',
        };
    
        // Create and log in a user
        const hashedPassword = await hashHelper.hashPassword(userData.password);
        await User.create({
          email: userData.email,
          password: hashedPassword,
          username: userData.username,
        });
    
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: userData.password,
          });
    
        const token = loginResponse.body.token;
    
        const response = await request(app)
          .post('/api/auth/logout')
          .set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Logged out successfully');
      });
    
      it('should return 401 if no token is provided', async () => {
        jest.setTimeout(10000); // Set timeout to 10 seconds
        const response = await request(app).post('/api/auth/logout');
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Token not provided');
      });
    });

    describe('GET /me', () => {
      it('should return user details for an authenticated user', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          username: 'testUser',
        };
    
        // Create and log in a user
        const hashedPassword = await hashHelper.hashPassword(userData.password);
        const user = await User.create({
          email: userData.email,
          password: hashedPassword,
          username: userData.username,
        });
    
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: userData.password,
          });
    
        const token = loginResponse.body.token;
    
        const response = await request(app)
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.email).toBe(user.email);
        expect(response.body.data.username).toBe(user.username);
      });
    
      it('should return 401 if the user is not authenticated', async () => {
        const response = await request(app).get('/api/auth/me');
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Access denied. No token provided.');
      });
    });

    describe('PUT /update', () => {
      it('should update user details for an authenticated user', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          username: 'testUser',
        };
    
        const updatedData = {
          username: 'updatedUser',
        };
    
        // Create and log in a user
        const hashedPassword = await hashHelper.hashPassword(userData.password);
        const user = await User.create({
          email: userData.email,
          password: hashedPassword,
          username: userData.username,
        });
    
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: userData.password,
          });
    
        const token = loginResponse.body.token;
    
        const response = await request(app)
          .put('/api/auth/update')
          .set('Authorization', `Bearer ${token}`)
          .send(updatedData);
    
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.username).toBe(updatedData.username);
      });
    
      it('should return 401 if the user is not authenticated', async () => {
        const updatedData = {
          username: 'updatedUser',
        };
    
        const response = await request(app)
          .put('/api/auth/update')
          .send(updatedData);
    
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Access denied. No token provided.');
      });
    });

    describe('DELETE /delete', () => {
      it('should delete the user account for an authenticated user', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          username: 'testUser',
        };
    
        // Create and log in a user
        const hashedPassword = await hashHelper.hashPassword(userData.password);
        await User.create({
          email: userData.email,
          password: hashedPassword,
          username: userData.username,
        });
    
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: userData.password,
          });
    
        const token = loginResponse.body.token;
    
        const response = await request(app)
          .delete('/api/auth/delete')
          .set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('User account deleted successfully');
    
        const userInDb = await User.findOne({ email: userData.email });
        expect(userInDb).toBeNull();
      });
    
      it('should return 401 if the user is not authenticated', async () => {
        const response = await request(app).delete('/api/auth/delete');
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Access denied. No token provided.');
      });
    
      it('should return 404 if the user does not exist', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          username: 'testUser',
        };
      
        // Create a user
        const hashedPassword = await hashHelper.hashPassword(userData.password);
        await User.create({
          email: userData.email,
          password: hashedPassword,
          username: userData.username,
        });
      
        // Log in to get a token
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: userData.password,
          });
      
        const token = loginResponse.body.token;
      
        // Delete the user directly from the database
        await User.deleteOne({ email: userData.email });
      
        // Attempt to delete the user via API
        const response = await request(app)
          .delete('/api/auth/delete')
          .set('Authorization', `Bearer ${token}`);
      
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('User not found');
      });
      
    });
  });
