const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const helmet = require("helmet");
const router = require("./src/routes/index");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
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
app.use(nocache());
app.use("/public", express.static("./public"));
app.use("/api", router);

app.listen(process.env.SERVER_PORT, () => {
	console.log(`\n Server is running on port ${process.env.SERVER_PORT} ...\n`);
});
