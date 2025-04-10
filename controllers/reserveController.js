const Listing = require('../models/listing');

module.exports.reserveListing = async (req, res) => {
    const { id } = req.params;
    const { nights } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    const subtotal = listing.price * nights;
    const serviceFee = Math.round(subtotal * 0.15);
    const total = subtotal + serviceFee;

    res.render('listings/confirmation', { listing, nights, subtotal, serviceFee, total });
};
