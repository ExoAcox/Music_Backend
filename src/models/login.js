const mongodb = require("mongodb").MongoClient;
const bcrypt = require("bcryptjs");
require("dotenv").config();
const url = process.env.MONGO_SERVER;

function checkUsername(username) {
	return new Promise((resolve) => {
		// check if user login with email or username
		const type = /@/.test(username) ? { email: username } : { username };
		mongodb.connect(url, { useUnifiedTopology: true }, (err, conn) => {
			if (err) throw err;
			conn.db()
				.collection("user")
				.findOne(type, (err, result) => {
					if (err) throw err;
					resolve(result);
					conn.close();
				});
		});
	});
}
function hash(password) {
	return new Promise((resolve) => {
		bcrypt.hash(password, 10, function (err, hash) {
			if (err) throw err;
			resolve(hash);
		});
	});
}

module.exports = {
	login: async (username, password) => {
		return new Promise(async (resolve, reject) => {
			// check if username exist or not
			const userData = await checkUsername(username);
			if (!userData) {
				reject("Username or email not found!");
			} else {
				bcrypt.compare(password, userData.password, (err, result) => {
					if (result) {
						resolve(userData);
					} else {
						reject("Password incorrect!");
					}
				});
			}
		});
	},
	verify: async (username) => {
		return new Promise(async (resolve, reject) => {
			// check if username exist or not
			const userData = await checkUsername(username);
			if (!userData) {
				reject("Username or email not found!");
			} else {
				resolve(userData);
			}
		});
	},
	loginSocial: (email, data) => {
		return new Promise(async (resolve) => {
			// check if username exist or not
			const userData = await checkUsername(email);
			if (!userData) {
				resolve({ ...data, register: true });
			} else {
				resolve(userData);
			}
		});
	},
	register: (username, email, password) => {
		return new Promise(async (resolve, reject) => {
			const regex = /[a-z0-9]/gi;
			if (username.length < 4 || username.length > 12 || !regex.test(username)) {
				reject("Username must contain 4 - 12 character and not included special char!");
			}
			if (password.length < 6) {
				reject("Password must have min 6 character!");
			}
			if (await checkUsername(username)) {
				reject("Username has already been taken!");
			}
			if (await checkUsername(email)) {
				reject("Email has already been taken!");
			}
			const passwordHash = await hash(password);
			mongodb.connect(url, { useUnifiedTopology: true }, (err, conn) => {
				if (err) throw err;
				conn.db()
					.collection("user")
					.insertOne({ username, email, password: passwordHash }, (err, result) => {
						if (err) throw err;
						resolve(result);
						conn.close();
					});
			});
		});
	},
};
