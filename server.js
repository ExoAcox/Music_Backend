const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const helmet = require("helmet");
const router = require("./src/routes/index");
const cors = require("cors");
const nocache = require("nocache");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const app = express();
require("dotenv").config();

app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(
	cookieSession({
		name: "session",
		secret: "ghftydtrdgf",
		maxAge: 24 * 60 * 60 * 1000 * 30, // 30 days
		httpOnly: true,
	}),
);
app.use((req, res, next) => {
	req.session.nowInMinutes = Math.floor(Date.now() / 3600e3);
	next();
});
app.use(passport.initialize());
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			callbackURL: "http://127.0.0.1:9999/api/login/google/callback",
		},
		function (accessToken, refreshToken, user, done) {
			if (user) {
				// console.log(accessToken);
				// console.log(profile);
				return done(null, user);
			} else {
				return done(null, false);
			}
		},
	),
);
passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_ID,
			clientSecret: process.env.FACEBOOK_SECRET,
			callbackURL: "http://127.0.0.1:9999/api/login/facebook/callback",
			profileFields: ["id", "displayName", "photos", "email"],
			enableProof: true,
		},
		function (accessToken, refreshToken, user, done) {
			if (user) {
				// console.log(accessToken);
				// console.log(profile);
				return done(null, user);
			} else {
				return done(null, false);
			}
		},
	),
);
passport.serializeUser(function (user, done) {
	done(null, user.id);
});
passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});
app.use(nocache());
app.use("/public", express.static("./public"));
app.use("/api", router);

app.listen(process.env.SERVER_PORT, () => {
	console.log(`\n Server is running on port ${process.env.SERVER_PORT} ...\n`);
});
