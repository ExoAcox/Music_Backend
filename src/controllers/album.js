const album = require("../models/album");

module.exports = {
	getAlbum: (req, res) => {
		album.getAlbum(req.params.id).then(resolve => {
			res.json(resolve);
		});
	},
	getRandomAlbum: (req, res) => {
		album.getRandomAlbum(req.body).then(resolve => {
			res.json(resolve);
		});
	},
	addAlbum: (req, res) => {
		album.addAlbum(req.body.data).then(resolve => {
			res.json(resolve);
		});
	},
	editAlbum: (req, res) => {
		const { artist_name, album_name, artist_id, album_id, release_date, track_count, album_cover } = req.body;
		// _id == album_id

		const data = {};
		if (artist_name) {
			data.artist_name = artist_name;
		}
		if (album_name) {
			data.album_name = album_name;
		}
		if (artist_id) {
			data.artist_id = artist_id;
		}
		if (release_date) {
			data.release_date = release_date;
		}
		if (track_count) {
			data.track_count = track_count;
		}
		if (album_cover) {
			data.album_cover = album_cover;
		}
		if (_id) {
			data.album_id = album_id;
		}

		album.editAlbum(data, req.params.id).then(resolve => {
			res.json(resolve);
		});
	},
	deleteAlbum: (req, res) => {
		album.deleteAlbum(req.params.id).then(resolve => {
			res.json(resolve);
		});
	},
};
