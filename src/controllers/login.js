const login = require("../models/login");
const jwt = require("jsonwebtoken");

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
			.register(req.body.username, req.body.password)
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
	callback: (req, res) => {
		if (!req.user) {
			res.status(301).redirect("http://127.0.0.1:8080/login");
			return;
		}
		req.session.user = req.user;
		res.status(301).redirect("http://127.0.0.1:8080");
	},
};
