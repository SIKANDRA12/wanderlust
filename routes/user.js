const express = require("express");
const router = express.Router();
const passport = require("passport");  
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
    .route("/signup")
    .get(userController.signupRenderRoute)
    .post( wrapAsync(userController.signupPostIsRegisterRoute))
router;

router
  .route("/login")
  .get(userController.loginGetRoute)
  .post(
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect: "/login", 
    failureFlash: true, 
    }), userController.isLoginPostRoute)
// logout router
router.get("/logout",userController.isLogoutRoute);
module.exports = router;