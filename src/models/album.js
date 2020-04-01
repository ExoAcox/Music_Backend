const mongodb = require("mongodb").MongoClient;
const url = process.env.MONGO_SERVER;
// const download = require("image-downloader");

module.exports = {
	getAlbum: id => {
		return new Promise(resolve => {
			mongodb.connect(url, { useUnifiedTopology: true }, (err, conn) => {
				if (err) throw err;
				conn
					.db()
					.collection("album")
					.findOne({ album_id: id }, (err, result) => {
						if (err) throw err;
						resolve(result);
					});
			});
		});
	},
	getRandomAlbum: data => {
		return new Promise(resolve => {
			const source = data.template ? (data.template.length < 100 ? JSON.parse(data.template) : []) : [];
			const random = leftover => {
				mongodb.connect(url, { useUnifiedTopology: true }, async (err, conn) => {
					if (err) throw err;
					conn
						.db()
						.collection("album")
						.aggregate([{ $sample: { size: leftover } }])
						.toArray((err, result) => {
							if (err) throw err;
							const unique = new Set(result);
							const number = leftover - (source.length + [...unique].length);
							if (number > 0) {
								source = [source, ...unique];
								random(number);
							} else {
								resolve([source, ...unique].slice(1));
							}
						});
				});
			};
			random(data.max || 5);
		});
	},
	addAlbum: data => {
		return new Promise(resolve => {
			mongodb.connect(url, { useUnifiedTopology: true }, (err, conn) => {
				if (err) throw err;
				conn
					.db()
					.collection("album")
					.insertMany(data, (err, result) => {
						if (err) throw err;
						resolve(result);
					});
			});
		});
	},
	editAlbum: (data, id) => {
		return new Promise(resolve => {
			mongodb.connect(url, { useUnifiedTopology: true }, (err, conn) => {
				if (err) throw err;
				conn
					.db()
					.collection("album")
					.updateOne({ _id: id }, { $set: data }, (err, result) => {
						if (err) throw err;
						resolve(result);
					});
			});

			resolve(random);
		});
	},
	deleteAlbum: id => {
		return new Promise(resolve => {
			mongodb.connect(url, { useUnifiedTopology: true }, (err, conn) => {
				if (err) throw err;
				conn
					.db()
					.collection("album")
					.updateOne({ _id: id }, (err, result) => {
						if (err) throw err;
						resolve(result);
					});
			});

			resolve(random);
		});
	},
};
