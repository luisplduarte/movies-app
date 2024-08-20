const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
require('dotenv').config();  // Configure dotenv to access environment variables

mongoose.connect(process.env.NODE_ENV === 'test' ? process.env.MONGO_TESTS_URI : process.env.MONGO_URI) // Connect to DB

const app = express()  // Setup express server

app.use(cors())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(logger('dev'))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(passport.initialize()) // Passport middleware
require('./passport')(passport)  // Passport config

const indexRouter = require('./routes/index')
app.use('/', indexRouter)

module.exports = app