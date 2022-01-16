// Import Event Model
const Event = require("../models/Event");

exports.adminCreateEvent = function (req, res) {
  res.render("create-event");
};

exports.create = function (req, res) {
  let event = new Event(req.body, req.session.user._id);
  event
    .create()
    .then(function () {
      Event.returnEventId();
    })
    .catch(function (e) {
      res.send(e);
    });
};

exports.viewEvent = async function (req, res) {
  try {
    let event = await Event.viewSingleEvent(req.params.id);
    res.render("event", { event: event });
  } catch {
    res.render("404Error");
  }
};

// Access search page
exports.search = function(req, res) {
  res.render("search");
}

exports.eventsListPage = function (req, res) {
  res.render("events-page.ejs");
};
