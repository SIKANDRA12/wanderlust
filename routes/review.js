const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuther} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


// validate review 


//  create Reviews route
router
    .route("/")
    .post(
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReviewsRoute));
 // create review delete route 
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuther,
    wrapAsync(reviewController.createReviewDeleteRoute)
);
module.exports = router;