const router = require("express").Router();
const album = require("../controllers/album");
const auth = require("../configs/auth.js");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, "./public/img/album_cover");
	},
	filename: function(req, file, callback) {
		callback(null, req.body_id + ".jpg");
	},
});
const upload = multer({
	storage: storage,
});

router.get("/:id", album.getAlbum);
router.post("/", album.getRandomAlbum);
router.put("/", album.addAlbum);
router.patch("/", auth, upload.single("avatar"), album.editAlbum);
router.delete("/:id", auth, album.deleteAlbum);

module.exports = router;
