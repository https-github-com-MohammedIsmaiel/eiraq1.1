const router = require("express").Router();
const passport = require("passport");


router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.userId = req.user.appId;
    req.session.loggedin = true;
    req.session.loggedinuser=req.user.displayName;
    req.session.profileimg=req.user.profileimg;
    req.session.loggedinEmail=req.user.id;
    res.redirect("/profile");
  });

module.exports = router;
