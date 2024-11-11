const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const { listingSchema }= require("./schema.js");
const { reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req,res, next)=>{
    // console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()){
        //store originalUrl for accessing data
        req.session.redirectUrl = req.originalUrl ;
        req.flash("error","you must be logged in to create listing");
        // return res.redirect("/listings")
        return res.redirect("/login");
    }
    next();
}

// to save redirectUrl in locals
module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner = async(req, res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if( !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);   // Redirect back to the listings index page
    }
    next();
};

module.exports.validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
        
    }else{
        next();
    }
};
module.exports.validateReview = (req, res, next) => {
    // console.log(req.body); // Log the incoming review data
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuther = async(req, res,next)=>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the auther of this review");
        return res.redirect(`/listings/${id}`);  // Redirect back to the listings index page
    }
    next();
};