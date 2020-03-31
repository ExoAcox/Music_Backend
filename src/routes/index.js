const router = require("express").Router();
const user = require("./user");
const login = require("./login");
const album = require("./album");

router.use("/user", user);
router.use("/", login);
router.user("/album", album);

module.exports = router;
