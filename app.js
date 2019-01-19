const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

/**
 * Here we create our routes
 */
const serviceRoutes = require("./api/routes/services");
const testCommentRoutes = require("./api/routes/testComment");


/* Configuration file, for password and such */
require('dotenv').config();

/* Connecting to MongoDB with user + pass */
mongoose.connect(
  "mongodb://wamhouse:" +
    process.env.MONGO_WAM_PWD +
    "@127.0.0.1:27017/wamapi", 
  {
    useMongoClient: true
  }
);
mongoose.Promise = global.Promise;

/* Logging tool à la Apache Logs */
app.use(morgan("dev"));

/* Static-files route */
app.use('/uploads', express.static('uploads'));
/* Will parse header HTTP Requests */
app.use(bodyParser.urlencoded({ extended: false }));
/* Will parse JSON requests */
app.use(bodyParser.json());

/* Headers sent to clients */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

/* Defining URLs for our routes */
app.use("/services", serviceRoutes);
app.use("/test_comment", testCommentRoutes);

app.use((req, res, next) => { 
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ 
    error: {
      message: error.message
    }
  });
});

module.exports = app;
