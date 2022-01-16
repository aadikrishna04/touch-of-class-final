// Import Bcrypt for password hashing
const bcrypt = require("bcryptjs");

// Access users collection in database
const usersCollection = require("../db").db().collection("users");

// User Object
let User = function (data) {
  this.data = data;
  this.errors = [];
};

// Getting rid of extra spaces and capitalization issues in name and email
User.prototype.cleanUp = function () {
  this.data = {
    firstName: this.data.firstName,
    lastName: this.data.lastName,
    phone: this.data.phone,
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
    name: `${this.data.firstName} ${this.data.lastName}`,
    username: this.data.username,
    whatsApp: this.data.whatsApp,
    address: this.data.address,
    city: this.data.city,
    state: this.data.state,
  };
};

// Validating user data
User.prototype.validate = function () {
  // Checking for blank fields
  if (this.data.name == "") {
    this.errors.push("Name cannot be blank");
  }

  if (this.data.email == "") {
    this.errors.push("Email cannot be blank");
  }

  if (this.data.password == "") {
    this.errors.push("Password cannot be blank");
  }

  // Setting minimum length
  if (this.data.name.length < 3) {
    this.errors.push("Name must be at least 3 characters");
  }

  if (this.data.email.length < 6) {
    this.errors.push("Name must be at least 6 characters");
  }

  if (this.data.password.length < 6) {
    this.errors.push("Password must be at least 6 characters");
  }
};

// Register new user
User.prototype.register = function () {
  this.cleanUp();
  this.validate();

  // If there are no errors, insert User document into users collection
  if (!this.errors.length) {
    // Hash User's password
    let salt = bcrypt.genSaltSync(10);
    this.data.password = bcrypt.hashSync(this.data.password, salt);
    currentUser = this.data;
    // Insert user into database
    usersCollection.insertOne(this.data);
  }
};

// Login existing user
User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    // Call cleanup method which was called upon signup to make sure the values match
    this.cleanUp();

    // Search for existing user in database
    usersCollection
      .findOne({ email: this.data.email })
      .then((currentUser) => {
        // Compare inputted password with stored, hashed password
        if (
          currentUser &&
          bcrypt.compareSync(this.data.password, currentUser.password)
        ) {
          resolve("Succesfully logged in!");
        } else {
          reject("Error with login.");
        }
      })
      .catch(function () {
        reject("Error with application, please try again later.");
      });
  });
};

module.exports = User;
