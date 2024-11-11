const User = require("../models/user.js");


module.exports.signupRenderRoute = (req, res) =>{
    res.render("users/signup.ejs");
};
module.exports.signupPostIsRegisterRoute   = async(req, res ) =>{
    try{
        let { username, email, password } = req.body;
        const newUser = new User({email, username});
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) =>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wanderLust!");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
};

module.exports.loginGetRoute =  (req, res) =>{
    res.render("users/login.ejs");
};

module.exports.isLoginPostRoute = async(req, res) =>{
    req.flash("success","welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.isLogoutRoute = (req, res) =>{
    req.logout((err) =>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
};