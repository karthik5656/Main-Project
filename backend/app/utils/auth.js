const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../schema/userSchema');
require("dotenv").config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

/* password */

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password,salt);
	return hash
};

const comparePassword = async (password, hashedPassword) => {
	const isValid = await bcrypt.compare(password, hashedPassword);
	return isValid;
};

/* access token */

const generateAccessToken = (user) => {
	return jwt.sign(
		{
			_id: user._id,
			username: user.username,
			password: user.password,
		},
		"SomeRandomString"
	);
};

const verifyAccessToken = async (req, res, next) => {
	const { accessToken } = req.cookies;
	if (!accessToken)
		return res.status(401)
			.json({ success: false, body: { message: "No access token" } })
			
	jwt.verify(accessToken, "SomeRandomString", async (err, user) => {
		if (err)
			return res.status(401)
				.json({
					success: false,
					body: { message: "Invalid access token" },
				})		
		req.user = await User.findById(user._id);
		next();
	});
};

module.exports = {
	hashPassword,
	comparePassword,
	generateAccessToken,
	verifyAccessToken,
};
