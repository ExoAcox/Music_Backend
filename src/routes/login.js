const router = require("express").Router();
const login = require("../controllers/login");

router.post("/login", login.login);
router.post("/register", login.register);
router.get("/verify", login.verify);
router.get("/logout", login.logout);
router.post("/auth/google", login.google);

module.exports = router;
