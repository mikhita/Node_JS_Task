# Personal Finance Management System

This is a personal finance management system that allows users to track their income and expenses. The system is built with Node.js and MongoDB.

## Features

- User registration with encrypted password
- Password reset via email
- User login with JWT authentication
- Transaction creation with category id
- Adding transactions with missing category name to default category
- Filtering transactions by fields (status, min/max amount, expense/income)
- Using MongoDB database with aggregate method for array lookup
- One-to-many relationship between users and categories
- Many-to-many relationship between transactions and categories

## Installation

To install the dependencies, run:

To get started with the app, follow these steps:

Clone this repository to your local machine
Navigate to the project directory
Run npm install to install the required dependencies
Create a .env file in the project directory and add the following environment variables:
PORT - the port number to run the app on
MONGODB_URI - the URI for your MongoDB database
SECRET - a secret string to be used for JWT encoding and decoding
EMAIL - the email address to be used for sending password reset emails
EMAIL_PASSWORD - the password for the email address
Run npm start to start the app


## API Endpoints

The following API endpoints are available:

### User Routes

- `POST /api/users`: Create a new user
- `POST /api/users/login`: Login a user
- `POST /api/users/reset-password`: Request a password reset email
- `POST /api/users/new-password`: Reset password with token

### Category Routes

- `GET /api/categories`: Get all categories
- `POST /api/categories`: Create a new category
- `PUT /api/categories/:id`: Update an existing category

### Transaction Routes

- `GET /api/transactions`: Get all transactions
- `POST /api/transactions`: Create a new transaction
- `GET /api/transactions/incomes`: Get all income transactions
- `GET /api/transactions/expenses`: Get all expense transactions
- `GET /api/transactions/expenses?minAmount={value}&maxAmount={value}`: Get all expense transactions within a range of values
- `GET /api/transactions/filter?status={value}&minAmount={value}&maxAmount={value}&type={value}`: Filter transactions by status, amount, and type

## Technologies Used

- Node.js
- MongoDB
- Mongoose
- Express
- JWT
- Nodemailer

## Credits

This project was developed by Mikheil Ispiriani.
