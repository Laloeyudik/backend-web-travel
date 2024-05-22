const express = require("express");
const { TouristManager } = require("../domain/touristController");
const { ManageImage } = require("../../../libraries/images/imageManager");

const managerTourist = new TouristManager();
const managerImage = new ManageImage()
const routeTourist = express.Router();

routeTourist.get("/tourist-tours", (req, res) => {
  return managerTourist.getTourist(res);
});

routeTourist.get("/tourist-tours/by", (req, res) => {
  return managerTourist.getByIdTourist(req, res);
});

routeTourist.post("/add/tourist-tours", managerImage.upload().array("image", 7),(req, res) => {
  return managerTourist.addTourist(req, res);
});
routeTourist.put("/update/tourist-tours", (req, res) => {
  return managerTourist.editTourist(req, res);
});

module.exports = routeTourist;
