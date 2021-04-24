const router = require("express").Router();
const passport = require("passport");

router.get('/auth/twitter',
  passport.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.userId = req.user.appId;
    req.session.loggedin = true;
    req.session.loggedinuser=req.user.displayName;
    req.session.profileimg=req.user.profileimg;
    req.session.loggedinEmail=req.user.id;
    res.redirect("/profile");
  });

  module.exports = router;