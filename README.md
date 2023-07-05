![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)


# E-commerce Backend (MERN Stack)

This repository contains the backend code for an e-commerce application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). This application serves as the server-side component for managing various aspects of an online store.

## Features

- User authentication and authorization.
- Product management (CRUD operations).
- Shopping cart functionality.
- Order management and payment integration.
- User profile management.
- Admin dashboard for managing products, orders, and users.

## Technologies Used

- MongoDB: A NoSQL database used for data storage.
- Express.js: A fast and minimalist web application framework for Node.js.
- React.js: A JavaScript library for building user interfaces.
- Node.js: A JavaScript runtime environment used for server-side development.
- JSON Web Tokens (JWT): Used for user authentication and authorization.
- Stripe: A popular payment processing platform used for payment integration.
- Other libraries and dependencies: Express Validator, Bcrypt.js, Multer, etc.

## Getting Started

### Prerequisites

- Node.js and npm (Node Package Manager) should be installed on your system.
- MongoDB should be installed and running.

### Installation

1. Clone this repository: `git clone https://github.com/your-username/ecommerce-backend.git`
2. Navigate to the project directory: `cd ecommerce-backend`
3. Install the dependencies: `npm install`

### Configuration

1. Create a `.env` file in the root directory.
2. Configure the following environment variables:

```
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret-key>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
```

### Running the Application

1. Start the server: `npm start`
2. The server will run on `http://localhost:5000`.
3. Test the endpoints using an API testing tool like Postman.

## API Documentation

For detailed information about the available API endpoints and their usage, please refer to the [API documentation](API_DOCUMENTATION.md) file.

## Contributing

Contributions are welcome! If you find any bugs or want to add new features, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

