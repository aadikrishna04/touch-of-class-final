// Required imports
const express = require("express");
const router = express.Router();

// Import User Controller
const userController = require("./controllers/userController");
// Import Event Controller
const eventController = require("./controllers/eventController");

// Routing for landing page
router.get("/", userController.home);

// Routing for registration page
router.get("/register", function (req, res) {
  res.render("signUp");
});

router.post("/register", userController.register);

// Routing for login page
router.get("/login", function (req, res) {
  res.render("login");
});

router.post("/login", userController.login);

// Routing for logout
router.post("/logout", userController.logout);

// Routing for dashboard
router.get("/dashboard", userController.dashboard);

// Routing for create event (host) page
router.get(
  "/host",
  userController.isLoggedIn,
  eventController.adminCreateEvent
);

// Routing to post event data into database
router.post("/host", userController.isLoggedIn, eventController.create);

// Routing for individual events
router.get("/events/:id", eventController.viewEvent);

// Routing for events list page
router.get(
  "/events",
  userController.isLoggedIn,
  eventController.eventsListPage
);

router.get("/search", eventController.search);
// Export site routing
module.exports = router;
