if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
// require new data of npm ejs-mate for better boiler plat it help to create template 
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");  
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connection successful");
}).catch(err => {
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Body parsing middleware
app.use(express.urlencoded({extended: true }));  // for parsing form data
app.use(express.json());  // for parsing JSON bodies
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// create mongostore
const store = MongoStore.create(
    {
        mongoUrl: dbUrl,
        //When working with sensitive session data it is recommended to use encryption
        crypto:{
            secret:  process.env.SECRET,
        },
        //Interval (in seconds) between session updates.
        touchAfter: 24 * 3600,
    }
);

// create finding store error
store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});

// here create session 
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    // explore cookie expire
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },

};

app.get("/", (req, res) =>{
    res.redirect("/listings");
});



// session and flash
app.use(session(sessionOptions));
app.use(flash());

// for passport
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// locals middleware
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//  cpasul concept of module p
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);

// to search err from all route
app.all("*", (req,res,next) =>{
    next(new ExpressError(404,"page not found"));
});

app.use((err, req, res, next) =>{
   let { statusCode = 500, message= "something was wrong!"} = err;
   res.status(statusCode).render("error.ejs",{message}); 
});

app.listen(8080 , () =>{
    console.log("server is listenig to port 8080");
});