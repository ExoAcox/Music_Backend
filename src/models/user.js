const db = require("../configs/database");

module.exports = {
	getUser: username => {
		return new Promise(resolve => {
			db.query(`SELECT * FROM user WHERE username = '${username}'`, (err, result) => {
				if (err) reject(new Error(err));
				resolve(result);
			});
		});
	},
	editUser: (username, data) => {
		return new Promise((resolve, reject) => {
			db.query(`UPDATE user SET ? WHERE username = '${username}'`, data, (err, result) => {
				if (err) reject(new Error(err));
				resolve(result);
			});
		});
	},
	deleteUser: username => {
		return new Promise((resolve, reject) => {
			db.query(`DELETE FROM user WHERE username = '${username}'`, (err, result) => {
				if (err) reject(new Error(err));
				resolve(result);
			});
		});
	},
};
