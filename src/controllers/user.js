const user = require("../models/user");

module.exports = {
	getUser: (req, res) => {
		user.getUser(req.params.username).then(resolve => {
			res.json(resolve);
		});
	},
	editUser: (req, res) => {
		const { first_name, last_name, gender, address, email, phone, birthdate } = req.body;

		const data = {};
		if (first_name) {
			data.first_name = first_name;
		}
		if (last_name) {
			data.last_name = last_name;
		}
		if (gender) {
			data.gender = gender;
		}
		if (address) {
			data.address = address;
		}
		if (email) {
			data.email = email;
		}
		if (phone) {
			data.phone = phone;
		}
		if (birthdate) {
			data.birthdate = birthdate;
		}
		if (req.file) {
			data.avatar = req.file.originalname;
		}

		user.editUser(req.username, data).then(resolve => {
			res.json(resolve);
		});
	},
	deleteUser: (req, res) => {
		user.removeUser(req.username).then(resolve => {
			res.json(resolve);
		});
	},
};
