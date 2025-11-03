require('dotenv').config(); // ✅ must be first
const express = require('express');
const app = express();
const connect = require('./db/db.js');
const cookieParser = require('cookie-parser');
const rideRoutes = require('./routes/ride.routes');
const rabbitMq = require('./service/rabbit');


// ✅ Connect to MongoDB
connect();

// ✅ Connect to RabbitMQ
rabbitMq.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes
app.use('/', rideRoutes);

module.exports = app;
