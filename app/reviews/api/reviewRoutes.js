const express = require("express");
const { ReviewManage } = require("../domain/reviewController");
const { ManageImage } = require("../../../libraries/images/imageManager");

const manageImage = new ManageImage();
const manageReview = new ReviewManage();
const routReview = express.Router();

routReview.get("/reviews", (req, res) => {
  if (req.query.c) {
    return manageReview.getReviewsByKategori(req, res);
  } else {
    return manageReview.getReviews(res);
  }
});
routReview.post(
  "/add/reviews",
  manageImage.upload().array("image", 9),
  (req, res) => {
    return manageReview.addReviews(req, res);
  }
);
routReview.delete("/delete/reviews", (req, res) => {
  return manageReview.deleteReview(req, res);
});

module.exports = routReview;
