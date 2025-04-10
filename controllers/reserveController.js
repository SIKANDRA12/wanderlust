const Listing = require('../models/listing');

module.exports.reserveListing = async (req, res) => {
    const { id } = req.params;
    const { nights } = req.body;

    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash('error', 'Listing not found');
            return res.redirect('/listings');
        }

        const pricePerNight = listing.price;
        const subtotal = nights * pricePerNight;
        const serviceFee = Math.floor(subtotal * 0.1); // 10% service fee
        const total = subtotal + serviceFee;

        req.flash('success', `Reserved successfully for ${nights} night(s)! Total Price: $${total}`);
        res.redirect(`/listings/${id}`);
    } catch (err) {
        req.flash('error', 'Something went wrong');
        res.redirect('/listings');
    }
}

