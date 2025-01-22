# Backend Engineer Test Project

This project is designed as a test of backend engineering skills. It is a RESTful API built for managing products in a store, with features such as user authentication, product CRUD operations, and robust middleware for handling authentication and errors. The tech stack includes **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

## Project Purpose

The primary goal of this project is to demonstrate the ability to:
- Design and implement a scalable and maintainable backend architecture.
- Create secure and efficient authentication mechanisms.
- Use TypeScript effectively to ensure type safety and reduce runtime errors.
- Write clean and modular code for real-world backend systems.
- Employ Docker for containerized development and deployment.

## Features

### User Authentication
- **Registration**: Users can register with their email, password, and username.
- **Login**: Users can log in to receive a JSON Web Token (JWT) for authentication.
- **Token Validation**: Middleware checks for token validity and supports blacklisting.
- **User Management**: Users can update their details or delete their accounts.

### Product Management
- **Create**: Add new products with attributes like name, description, price, and stock.
- **Read**: Retrieve a list of all products or fetch details of a single product by its ID.
- **Update**: Update product details securely.
- **Delete**: Remove products from the database.

### Middleware
- **Authentication**: Verifies JWT tokens and checks for blacklisted tokens.
- **Error Handling**: Global error handling for API responses.
- **404 Not Found**: Handles undefined routes.

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime for building scalable backend services.
- **Express**: Web framework for building RESTful APIs.
- **TypeScript**: Adds static typing to JavaScript for better code reliability.
- **MongoDB**: NoSQL database for data storage.

### Development Tools
- **Docker**: Containerization for consistent development and deployment environments.
- **Jest**: Testing framework for unit tests.
- **ESLint & Prettier**: For maintaining code quality and formatting.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/isommie/backend-engineer-test.git
   cd backend-engineer-test
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   MONGO_INITDB_DATABASE=store_management_db
   ```

4. **Run the application**:
   - Development mode:
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm run start
     ```

5. **Run tests**:
   ```bash
   npm run test
   ```

6. **Build and run with Docker**:
   - Build the Docker image:
     ```bash
     docker build -t backend-engineer-test .
     ```
   - Run the container:
     ```bash
     docker run -p 5000:5000 backend-engineer-test
     ```

## Project Structure

```
src
├── config
│   └── database.ts       # MongoDB connection setup
├── controllers
│   ├── authController.ts # Handles user authentication logic
│   └── productController.ts # Handles product CRUD operations
├── middlewares
│   ├── authMiddleware.ts # JWT authentication and token blacklist
│   ├── errorMiddleware.ts # Error and 404 handling
├── models
│   ├── Token.ts          # Token blacklist schema
│   ├── User.ts           # User schema
│   └── Product.ts        # Product schema
├── routes
│   ├── authRoutes.ts     # Authentication-related routes
│   └── productRoutes.ts  # Product-related routes
├── utils
│   └── validation.ts     # Input validation utilities
├── tests/
│   ├── controllers/
│   │   ├── authController.test.ts
│   │   └── productController.test.ts
│   ├── middlewares/
│   │   ├── authMiddleware.test.ts
│   │   └── errorMiddleware.test.ts
│   ├── models/
│   │   ├── Token.test.ts
│   │   └── User.test.ts
│   ├── routes/
│   │   ├── authRoutes.test.ts
│   │   └── productRoutes.test.ts
│   └── config/
│       └── database.test.ts
├── jest.config.js
├── app.ts                # Main application setup
└── server.ts             # Server entry point
```

## API Documentation

API documentation is available via Postman. Import the [Postman collection](postman-collection.json) included in the repository to view all available endpoints.

## Future Improvements

- **Rate Limiting**: Prevent abuse by limiting the number of requests per user/IP.
- **Swagger Documentation**: Add Swagger/OpenAPI documentation for better developer onboarding.
- **Role-Based Access Control**: Enable more granular access permissions.
- **Unit Tests**: Expand test coverage for better reliability.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve this project.

## License

This project is licensed under the MIT License.

---

Thank you for reviewing this project. If you have any questions, please contact [anajembaedwin@gmail.com].
