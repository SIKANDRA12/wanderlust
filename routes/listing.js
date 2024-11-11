

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)
    );

router.get("/new", isLoggedIn, listingController.renderNewForm);
router.get("/search", wrapAsync(listingController.searchResults));  // Only one definition for /search

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteorDestroyListing)
    );

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;

// first way
// index route
// router.get(
//     "/",
//     wrapAsync(listingController.index),

// );

// New route
// router.get("/new", isLoggedIn,listingController.renderNewForm);
// router.get("/new", isLoggedIn,(req, res) =>{
//     // if(!req.isAuthenticated()){
//     //     req.flash("error","you must be logged in to create listing");
//     //     // return res.redirect("/listings")
//     //     return res.redirect("/login");
//     // }
//     // res.render("./listings/new.ejs");
// });

// //show route
// router.get( wrapAsync(listingController.showListing));

// // create route
// router.post(
//     "/",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.createListing)
//      // this is the first way to access variables of db
//     // other way in new.ejs
//     // let {title, description, image, price, country, location} = req.body;
//     // finding error
//     // if(!req.body.listing){
//     //     throw new ExpressError(400, "send valid data for listing");
//     // }
//     // if(!newListing.title){
//     //     throw new ExpressError(400, "title is missing");
//     // }
//     // if(!newListing.description){
//     //     throw new ExpressError(400, "Description is missing");
//     // }
//     // if(!newListing.location){
//     //     throw new ExpressError(400, "location is missing");
//     // }
   
   

// );

// // Edit route
// router.get("/:id/edit",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.renderEditForm));

// update route
// update route
// router.put("/:id",
//     isLoggedIn, 
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.updateListing));
// //delete route
// router.delete("/:id",
//     isLoggedIn, 
//     isOwner,
//     wrapAsync(listingController.deleteorDestroyListing)
// );


