const Listing = require("../models/listing"); // Ensure Listing is defined for data fetching
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  // Static calculation for now
  const nights = 5; // later you can get this from query or form input
  const subtotal = listing.price * nights;
  const serviceFee = Math.round(subtotal * 0.15); // 15% fee
  const total = subtotal + serviceFee;

  res.render("./listings/show.ejs", {
    listing,
    reviews: listing.reviews,
    nights,
    subtotal,
    serviceFee,
    total,
  });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();
  req.flash("success", "New Listing created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }
  let originalimageUrl = listing.image.url.replace("/upload", "/upload/w_250");
  res.render("./listings/edit.ejs", { listing, originalimageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteorDestroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};

module.exports.searchResults = async (req, res) => {
  const query = req.query.query ? req.query.query.toLowerCase() : "";
  if (!query) {
    req.flash("error", "Please enter a search term.");
    return res.redirect("/listings");
  }

  try {
    const results = await Listing.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { country: { $regex: query, $options: "i" } },
        { "owner.username": { $regex: query, $options: "i" } }, // Adjust for your schema's user reference
      ],
    }).populate("owner"); // Populate owner to get access to fields like username if needed

    res.render("listings/searchResults", { results });
  } catch (err) {
    console.error("Error during search:", err);
    req.flash("error", "An error occurred during search.");
    res.redirect("/listings");
  }
};
