// Required imports
const dotenv = require("dotenv");
const mongodb = require("mongodb");

// Configure dotenv for environment variables
dotenv.config();

// Open connection to MongoDB Atlas
mongodb.connect(
  process.env.URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    module.exports = client;
    const app = require("./app");
    app.listen(process.env.PORT);
  }
);