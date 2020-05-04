const router = require("express").Router();
const login = require("../controllers/login");
const passport = require("passport");

router.post("/login", login.login);
router.post("/register", login.register);
router.get("/verify", login.verify);
router.get("/logout", login.logout);

// GOOGLE OAUTH
router.get("/login/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get("/login/google/callback", passport.authenticate("google"), login.callback);

// FACEBOOK OAUTH
router.get("/login/facebook", passport.authenticate("facebook", { authType: "rerequest" }));
router.get("/login/facebook/callback", passport.authenticate("facebook"), login.callback);

module.exports = router;
