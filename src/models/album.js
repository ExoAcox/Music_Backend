const mongodb = require("mongodb").MongoClient;
require("dotenv").config();
const url = process.env.MONGO_SERVER;
const download = require("image-downloader");
const Jimp = require("jimp");

module.exports = {
	getAlbum: (id) => {
		return new Promise((resolve) => {
			mongodb.connect(url, { useUnifiedTopology: true }, (err, conn) => {
				if (err) throw err;
				conn.db()
					.collection("album")
					.findOne({ album_id: id }, (err, result) => {
						if (err) throw err;
						resolve(result);
						conn.close();
					});
			});
		});
	},
	getRandomAlbum: (data) => {
		return new Promise((resolve) => {
			let source = data.template ? (data.template.length < 100 ? JSON.parse(data.template) : []) : [];
			const random = (leftover) => {
				mongodb.connect(url, { useUnifiedTopology: true }, async (err, conn) => {
					if (err) throw err;
					conn.db()
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
								conn.close();
							}
						});
				});
			};
			random(data.max || 5);
		});
	},
	addAlbum: (data) => {
		return new Promise((resolve) => {
			mongodb.connect(url, { useUnifiedTopology: true }, (err, conn) => {
				if (err) throw err;
				data.forEach((x) => {
					download
						.image({ url: x.album_cover, dest: "./public/img/cover/" + x.album_id + ".jpg" })
						.then((result) => {
							if (x.custom_cover) {
								Jimp.read(result.filename, (err, image) => {
									if (err) throw err;
									image.resize(300, 300).quality(90).write(result.filename);
									console.log("Convert: " + x.artist_name + " - " + x.album_name);
								});
							} else {
								console.log("No Convert: " + x.artist_name + " - " + x.album_name);
							}
						})
						.catch((err) => console.error(err));
				});
				const final = data.map((x) => {
					const source = {
						album_name: x.album_name,
						album_id: x.album_id,
						artist_name: x.artist_name,
						artist_id: x.artist_id,
						itunes_url: x.itunes_url,
						track_count: x.track_count,
						release_date: x.release_date,
					};
					return source;
				});
				conn.db()
					.collection("album")
					.insertMany(final, (err, result) => {
						if (err) throw err;
						resolve(result);
						conn.close();
					});
			});
		});
	},
	editAlbum: (data, id) => {
		return new Promise((resolve) => {
			mongodb.connect(url, { useUnifiedTopology: true }, (err, conn) => {
				if (err) throw err;
				conn.db()
					.collection("album")
					.updateOne({ album_id: id }, { $set: data }, (err, result) => {
						if (err) throw err;
						resolve(result);
						conn.close();
					});
			});
		});
	},
	deleteAlbum: (id) => {
		return new Promise((resolve) => {
			mongodb.connect(url, { useUnifiedTopology: true }, (err, conn) => {
				if (err) throw err;
				conn.db()
					.collection("album")
					.updateOne({ _id: id }, (err, result) => {
						if (err) throw err;
						resolve(result);
						conn.close();
					});
			});
		});
	},
};
