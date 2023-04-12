const { Router } = require("express");
const {
	refresh,
	login,
	logout,
} = require("../controllers/authController");
const { verifyAccessToken } = require("../utils/auth");

const router = Router();

router.post("/login", login);

router.put("/refresh", verifyAccessToken, refresh);

router.delete("/logout", verifyAccessToken, logout);

module.exports = router;
