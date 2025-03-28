# My Project
# FullStackExam-SameerVerma-26-03-nodejs

# Live 
https://fullstackexam-sameerverma-26-03-nodejs.onrender.com

Installation

Clone the repository
Install dependencies:

npm install

Create a .env file with the following variables:

# Server
PORT=
NODE_ENV=
# JWT
JWT_SECRET=
JWT_EXPIRE=
# MySQL Database
SQL_HOST=
SQL_PORT=
SQL_USER=
SQL_PASSWORD=
SQL_DATABASE=
SQL_SSL_MODE=
# MongoDB
MONGO_URI=
 

 <!-- sql queries   -->
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
  


Development: npm run dev
Production: npm run build && npm start

## Folder Structure
- `src/config/`: Database and environment configurations
- `src/models/`: Database models for SQL and MongoDB
- `src/controllers/`: Business logic for different routes
- `src/routes/`: API route definitions
- `src/middleware/`: Custom middleware
- `src/utils/`: Utility functions

## API Endpoints
- `/api/auth/`: User authentication
- `/api/products/`: Product catalog
- `/api/cart/`: Shopping cart
- `/api/orders/`: Order management
- `/api/reports/`: Sales and revenue reports