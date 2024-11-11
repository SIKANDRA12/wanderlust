const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title:{
        type: String,
        require:true,
    } ,
    description: {
        type: String,
        
    } ,
    image: {
       url: String,
       filename: String,
    } ,
    price:{
        type: Number,
    },
    location:{
        type: String,
    },
    country: {
        type: String,
        require:true,
    } ,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref: "User",
    },
    geometry:{
        
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
    },
    category:{
        type: String,
        enum:["country","location","title"],
    },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;