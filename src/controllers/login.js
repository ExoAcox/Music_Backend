const login = require("../models/login");
const jwt = require("jsonwebtoken");
const Axios = require("axios");

module.exports = {
	login: (req, res) => {
		login
			.login(req.body.username, req.body.password)
			.then((resolve) => {
				delete resolve.password;
				req.session.token = jwt.sign({ username: username }, process.env.SECRET_KEY);
				res.json(resolve);
			})
			.catch((reject) => {
				res.json({ error: reject });
			});
	},
	verify: (req, res) => {
		login
			.login(null, null, req.username)
			.then((resolve) => {
				delete resolve.password;
				res.json(resolve);
			})
			.catch((reject) => {
				res.json({ error: reject });
			});
	},
	register: (req, res) => {
		login
			.register(req.body.username, req.body.email, req.body.password)
			.then((resolve) => {
				res.json(resolve);
			})
			.catch((reject) => {
				res.json({ error: reject });
			});
	},
	logout: (req, res) => {
		req.logout;
		req.session = null;
		res.json({ info: "Logout success!" });
	},
	google: (req, res) => {
		Axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
			headers: {
				Authorization: "Bearer " + req.body.token,
			},
		})
			.then((resolve) => {
				login
					.loginSocial(resolve.data.email, resolve.data)
					.then((resolve2) => {
						delete resolve.password;
						req.session.token = jwt.sign({ username: resolve.email }, process.env.SECRET_KEY);
						res.json(resolve2);
					})
					.catch((reject) => {
						res.json({ error: reject });
					});
			})
			.catch((reject) => {
				res.json(reject);
			});
	},
};
