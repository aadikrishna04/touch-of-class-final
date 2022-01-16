const eventsCollection = require("../db").db().collection("events");
const ObjectID = require("mongodb").ObjectID;

let Event = function (data, id) {
  this.data = data;
  this.errors = [];
  this.userid = id;
  this.eventId = "";
};

Event.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
      // Save event to database only if there are no errors
      eventsCollection
        .insertOne(this.data)
        .then(() => {
          this.eventId = this.data._id;
          // Resolve only once event is inserted into DB
          resolve();
        })
        .catch(() => {
          // Display message if there is an issue with event.
          this.errors.push("Try again later");
          reject(this.errors);
        });
    } else {
      // Reject promise if there are errors
      reject(this.errors);
    }
  });
};

// View Event
Event.viewSingleEvent = function (id) {
  return new Promise(async function (resolve, reject) {
    if (typeof id != "string" || !ObjectID.isValid(id)) {
      reject();
      return;
    }
    let events = await eventsCollection
      .aggregate([
        { $match: { _id: new ObjectID(id) } },
        {
          $lookup: {
            from: "users",
            localField: "host",
            foreignField: "_id",
            as: "hostDocument",
          },
        },
        {
          $project: {
            title: 1,
            desc: 1,
            email: 1,
            phone: 1,
            name: 1,
            date: 1,
            time: 1,
            address: 1,
            host: { $arrayElemAt: ["$hostDocument", 0] },
          },
        },
      ])
      .toArray();
    if (events.length) {
      resolve(events[0]);
    } else {
      reject();
    }

    // Clean up host properties in each event object
    events = events.map(function (event) {
      event.host = {
        name: event.host.name,
        email: event.host.email,
        phone: event.host.phone,
        masterId: event.host.masterId,
      };
      return event;
    });
  });
};

Event.findByMasterId = function (masterId) {
  return Post.publicEventsQuery([
    { $match: { master: masterId } },
    { $sort: { date: -1 } },
  ]);
};

Event.returnEventId = function (req, res) {
  res.send(this.event._id);
};

Event.prototype.cleanUp = function () {
  this.data = {
    uid: this.data._id,
    name: this.data.name,
    email: this.data.email,
    phone: this.data.phone,
    address: this.data.address,
    date: this.data.date,
    time: this.data.time,
    title: this.data.title,
    desc: this.data.desc,
    host: ObjectID(this.userid),
  };
};

Event.prototype.validate = function () {
  if (this.data.name == "") {
    this.errors.push("Name cannot be blank.");
  }

  if (this.data.email == "") {
    this.errors.push("E-mail cannot be blank.");
  }

  if (this.data.phone == "") {
    this.errors.push("Phone number cannot be blank.");
  }

  if (this.data.address == "") {
    this.errors.push("Address cannot be blank.");
  }

  if (this.data.date == "") {
    this.errors.push("You must select a date.");
  }

  if (this.data.time == "") {
    this.errors.push("You must select a time");
  }

  if (this.data.desc == "") {
    this.errors.push("Your event must have a description.");
  }
};

module.exports = Event;
