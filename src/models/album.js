const mongodb = require("mongodb").MongoClient;
const url = process.env.MONGO_SERVER;
const download = require("image-downloader");

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
			const random = data.template ? JSON.parse(data.template) : [];
			let x = 0;

			mongodb.connect(url, { useUnifiedTopology: true }, (err, conn) => {
				if (err) throw err;
				while (x < data.max) {
					conn
						.db()
						.collection("album")
						.aggregate([{ $sample: { size: 1 } }])
						.toArray((err, result) => {
							if (err) throw err;
							if (!random.includes(result[0].album_id)) {
								random.push(result);
								x++;
							}
						});
				}
			});

			resolve(random);
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
						data.forEach(x => {
							if (x.album_cover) {
								download
									.image({ url: x.album_cover, dest: "./public/img/cover/" + x._id + ".jpg" })
									.then(result2 => {
										console.log(result2);
									})
									.catch(err2 => {
										console.error(err2);
									});
							}
						});
						resolve(result);
					});
			});

			resolve(random);
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
						if (data.album_cover) {
							download
								.image({ url: data.album_cover, dest: "./public/img/cover/" + id + ".jpg" })
								.then(result2 => {
									console.log(result2);
								})
								.catch(err2 => {
									console.error(err2);
								});
						}
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
