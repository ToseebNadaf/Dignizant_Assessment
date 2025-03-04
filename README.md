# 🛒 E-Commerce Backend API

This is a scalable e-commerce backend built using Node.js, Express, PostgreSQL, and Prisma. It includes features like user authentication, product management, shopping cart, orders, payment integration with Stripe, product reviews, and wishlist functionality.

## Features
- **User Authentication:**  
  - User registration and login with JWT-based authentication.
  - Role-based access control (Admin and User roles).
- **Product Management:**  
  - CRUD operations for products (Admin only).
  - Fetch all products with pagination.
  - Fetch a single product by ID.
- **Shopping Cart:**  
  - Add products to the cart.
  - Fetch the user's cart.
  - Remove products from the cart.
- **Orders:**  
  - Place an order..
  - Fetch user's orders.
  - Update order status (e.g., PENDING, PAID).
- **Payment Integration:**  
  - Initiate payment using Stripe.
  - Handle Stripe webhooks for payment confirmation.
- **Product Reviews & Ratings:**  
  - Add a review for a product.
  - Fetch all reviews for a product.
  - Update or delete a review.
- **Wishlist:**  
  - Add products to the wishlist.
  - Fetch the user's wishlist.
  - Remove products from the wishlist.

## 📂 Project Structure


| Folders     | Endpoints                                                 |
| ----------- | --------------------------------------------------------- |
| controllers | Controllers for handling business logic                   |
| middlewares | Custom middlewares (e.g., authentication, error handling) |
| routes      | API routes                                                |
| utils       | Utility functions (e.g., Stripe initialization)           |
| prisma      | Prisma schema and migrations                              |
| server.js   | Entry point of the application                            |


## Setup Instructions
### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- Stripe account (for payment integration)

### Steps
1. **Clone the Repository:**
  ```
  git clone https://github.com/your-username/dignizant.git
  cd dignizant
  ```

2. **Install Dependencies:**
  ```
  npm install
  ```

3. **Set Up Environment Variables:**
Create a `.env` file in the root directory and add the following variables:
  ```
  PORT=3000
  DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/dignizant"
  JWT_SECRET=
  STRIPE_SECRET_KEY=
  STRIPE_WEBHOOK_SECRET=
  FRONTEND_URL=http://localhost:3000
  ```

4. **Run Migrations:**
  ```
  npx prisma migrate dev --name init
  ```

5. **Start the Server:**
  ```
  npm run dev
  ```

6. **Access the API:** The API will be running at `http://localhost:3000/api`. 


## 📄 API Endpoints
### Base URL  
  ```
  http://localhost:3000/api
  ```
### Authentication
All endpoints (except `/auth/register` and `/auth/login`) require a valid JWT token in the Authorization header:
  ```
  Authorization: Bearer <token>
  ```

- Register a User:
  - Endpoint: `POST /api/auth/register`
  - Request Body:
    ```
    {
      "username": "john_doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```

- Login User:
  - Endpoint: `POST /api/auth/login`
  - Request Body:
    ```
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```

### Products

- Create Product (Admin Only):
  - Endpoint: `POST /api/products`
  - Request Body:
    ```
    {
      "name": "iPhone 15",
      "price": 1200,
      "description": "Latest iPhone model",
      "stock": 50,
      "category": "Electronics",
      "image": "image_url"
    }
    ```

- Fetch All Products:
  - Endpoint: `GET /api/products`
  - Query Params: <br>
    `page` (optional): Page number (default: 1) <br> 
    `limit` (optional): Page number (default: 1)

- Fetch Single Product:
  - Endpoint: `GET /api/products/:id`


### Cart

- Add Product to Cart:
  - Endpoint: `POST /api/cart/add`
  - Request Body:
    ```
    {
      "productId": 1,
      "quantity": 2
    }
    ```

- Fetch User's Cart:
  - Endpoint: `GET /api/cart`

### Orders

- Place Order:
  - Endpoint: `POST /api/orders`

- Fetch User's Orders:
  - Endpoint: `GET /api/orders/:userId`


### Payment

- Initiate Payment:
  - Endpoint: `POST /api/payment/checkout`


### Reviews

- Add Review:
  - Endpoint: `POST /api/reviews`
  - Request Body:
    ```
    {
      "productId": 1,
      "rating": 5,
      "comment": "Great product!"
    }
    ```

- Fetch Product Reviews:
  - Endpoint: `GET /api/reviews/:productId`


### Wishlist

- Add Product to Wishlist:
  - Endpoint: `POST /api/wishlist/add`
  - Request Body:
    ```
    {
      "productId": 1
    }
    ```
- Fetch User's Wishlist:
  - Endpoint: `GET /api/wishlist`
