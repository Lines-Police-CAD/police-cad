var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var vehicleSchema = mongoose.Schema({
  vehicle: {
    email: String, //deprecated 05/19/2021
    plate: String,
    vin: String,
    model: String,
    color: String,
    validRegistration: String,
    validInsurance: String,
    registeredOwner: String,
    registeredOwnerID: String,
    isStolen: String,
    activeCommunityID: String,
    userID: String,
    createdAt: Date,
    updatedAt: Date,
  },
});

vehicleSchema.methods.createVeh = function (req, res) {
  // console.debug("req body: ", req.body)
  if (exists(req.body.plate)) {
    this.vehicle.plate = req.body.plate.trim().toUpperCase();
  }
  if (exists(req.body.vin)) {
    this.vehicle.vin = req.body.vin.trim().toUpperCase();
  }
  if (exists(req.body.model)) {
    this.vehicle.model =
      req.body.model.trim().charAt(0).toUpperCase() +
      req.body.model.trim().slice(1);
  }
  if (exists(req.body.color)) {
    this.vehicle.color =
      req.body.color.trim().charAt(0).toUpperCase() +
      req.body.color.trim().slice(1);
  }
  if (exists(req.body.validRegistration)) {
    this.vehicle.validRegistration = req.body.validRegistration;
  }
  if (exists(req.body.validInsurance)) {
    this.vehicle.validInsurance = req.body.validInsurance;
  }
  if (exists(req.body.registeredOwnerID)) {
    this.vehicle.registeredOwnerID = req.body.registeredOwnerID;
  }
  if (exists(req.body.registeredOwner)) {
    this.vehicle.registeredOwner = req.body.registeredOwner.trim();
  }
  if (exists(req.body.isStolen)) {
    this.vehicle.isStolen = req.body.isStolen;
  }
  this.vehicle.activeCommunityID = req.body.activeCommunityID; // we set this when submitting the from so it should not be null
  this.vehicle.userID = req.body.userID; // we set this when submitting the from so it should not be null
  this.vehicle.createdAt = new Date();
  res.redirect("/civ-dashboard");
};

vehicleSchema.methods.socketCreateVeh = function (req, res) {
  // console.debug("req body: ", req.body)
  if (exists(req.body.plate)) {
    this.vehicle.plate = req.body.plate.trim().toUpperCase();
  }
  if (exists(req.body.vin)) {
    this.vehicle.vin = req.body.vin.trim().toUpperCase();
  }
  if (exists(req.body.model)) {
    this.vehicle.model =
      req.body.model.trim().charAt(0).toUpperCase() +
      req.body.model.trim().slice(1);
  }
  if (exists(req.body.color)) {
    this.vehicle.color =
      req.body.color.trim().charAt(0).toUpperCase() +
      req.body.color.trim().slice(1);
  }
  if (exists(req.body.validRegistration)) {
    this.vehicle.validRegistration = req.body.validRegistration;
  }
  if (exists(req.body.validInsurance)) {
    this.vehicle.validInsurance = req.body.validInsurance;
  }
  if (exists(req.body.registeredOwnerID)) {
    this.vehicle.registeredOwnerID = req.body.registeredOwnerID;
  }
  if (exists(req.body.registeredOwner)) {
    this.vehicle.registeredOwner = req.body.registeredOwner.trim();
  }
  if (exists(req.body.isStolen)) {
    this.vehicle.isStolen = req.body.isStolen;
  }
  this.vehicle.activeCommunityID = req.body.activeCommunityID; // we set this when submitting the from so it should not be null
  this.vehicle.userID = req.body.userID; // we set this when submitting the from so it should not be null
  this.vehicle.createdAt = new Date();
};

function exists(v) {
  if (v !== undefined && v != null) {
    return true;
  } else {
    return false;
  }
}

module.exports = mongoose.model("Vehicle", vehicleSchema);
