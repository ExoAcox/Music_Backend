const login = require("../models/login");

module.exports = {
	login: (req, res) => {
		login
			.login(req.body.username, req.body.password)
			.then(resolve => {
				res.json(resolve);
			})
			.catch(reject => {
				res.json({ error: reject });
			});
	},
	register: (req, res) => {
		login
			.register(req.body.username, req.body.password)
			.then(resolve => {
				res.json(resolve);
			})
			.catch(reject => {
				res.json({ error: reject });
			});
	},
};
