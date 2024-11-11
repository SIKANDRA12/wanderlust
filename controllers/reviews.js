const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
module.exports.createReviewsRoute = async(req, res) =>{
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    await listing.save();
    res.locals.successMsg = req.flash("success"," New Review created");
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);

};
module.exports.createReviewDeleteRoute = async(req, res) =>{
    let {id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: { reviews: reviewId} });
    let result = await Review.findByIdAndDelete(reviewId);
    res.locals.successMsg = req.flash("success"," Review Deleted");
    console.log(result);
    res.redirect(`/listings/${id}`);
};