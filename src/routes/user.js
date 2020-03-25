const router = require("express").Router();
const user = require("../controllers/user");
const auth = require("../configs/auth.js");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, "./public/img/avatar");
	},
	filename: function(req, file, callback) {
		callback(null, file.originalname);
	},
});
const upload = multer({
	storage: storage,
});

router.get("/:username", user.getUser);
router.patch("/", auth, upload.single("avatar"), user.editUser);
router.delete("/", auth, user.deleteUser);

module.exports = router;
