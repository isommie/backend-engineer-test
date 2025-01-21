import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../app';
import { Product } from '../../models/Product';
import { User } from '../../models/User';
import { hashHelper } from '../../utils/hashHelper';

let mongoServer: MongoMemoryServer;
let authToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {});
  }

  const registerResponse = await request(app).post('/api/auth/register').send({
    username: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });

  if (registerResponse.status === 201) {
    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    if (loginResponse.body && loginResponse.body.token) {
      authToken = loginResponse.body.token;
    } else {
      throw new Error('Auth token not found in login response');
    }
  } else {
    throw new Error('User registration failed');
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Product Controller', () => {
  describe('GET /api/products', () => {
    it('should return all products', async () => {
      await Product.create({
        name: 'Test Product',
        price: 100,
        description: 'Test product description',
        category: 'Test category',
        stock: 10,
      });

      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a product by ID', async () => {
      const newProduct = await Product.create({
        name: 'Test Product',
        price: 100,
        description: 'Test description',
        category: 'Test category',
        stock: 10,
      });

      const response = await request(app)
        .get(`/api/products/${newProduct._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(newProduct.id);
    });

    it('should return 404 if product not found', async () => {
      const invalidId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/products/${invalidId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'New Product',
        price: 50,
        description: 'A new product',
        category: 'Category',
        stock: 20,
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(productData.name);
    });

    it('should return 400 for invalid product data', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ price: 50 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid product data');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product by ID', async () => {
      const newProduct = await Product.create({
        name: 'Old Product',
        price: 80,
        description: 'Old description',
        category: 'Old category',
        stock: 15,
      });

      const updatedData = {
        name: 'Updated Product',
        price: 120,
      };

      const response = await request(app)
        .put(`/api/products/${newProduct._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updatedData.name);
      expect(response.body.data.price).toBe(updatedData.price);
    });

    it('should return 404 for a non-existent product ID', async () => {
      const invalidId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/products/${invalidId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Product' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product by ID', async () => {
      const newProduct = await Product.create({
        name: 'Test Product',
        price: 100,
        description: 'Description',
        category: 'Category',
        stock: 10,
      });

      const response = await request(app)
        .delete(`/api/products/${newProduct._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product deleted successfully');

      const productInDb = await Product.findById(newProduct._id);
      expect(productInDb).toBeNull();
    });

    it('should return 404 if product does not exist', async () => {
      const invalidId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/products/${invalidId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
    });
  });
});
