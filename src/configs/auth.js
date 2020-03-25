const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
	const token = req.headers["usertoken"];
	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		req.username = decoded.username;
		next();
	} catch (err) {
		console.log(err);
		res.json({
			msg: "Access denied!",
		});
	}
};
