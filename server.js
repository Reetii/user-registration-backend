const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const rateLimit = require("express-rate-limit");

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files

const auth = require('./routes/auth');
const users = require('./routes/users');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 15 minutes
  max: 1000
});
app.use(apiLimiter);

// File uploading


// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers

app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

app.use(errorHandler);

const PORT = process.env.PORT || 9000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
