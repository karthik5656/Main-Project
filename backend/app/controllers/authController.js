const User = require("../schema/userSchema");
const {
    comparePassword,
    generateAccessToken,
} = require("../utils/auth");

const login = async (req, res) => {
    const { username, password } = req.body.user;
    if (username === "" || password === "") {
        return res.status(400).json({
            success: false,
            message: "Credentials not provided"
        });
    }
    let user = await User.findOne({ email: username });
    if (!user) {
        res.status(404).json({
            success: false,
            message: "User does not exist"
        });
    } else if (!(await comparePassword(password, user.password)))
        return res.status(401).json({
            success: false,
            message: "Username and password do not match"
        });
    else {
        const accessToken = generateAccessToken(user);
        res.cookie("accessToken", accessToken, {
            sameSite: "None",
            secure: true,
        });
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user
        });
    }
};

const refresh = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({
        success: true,
        message: "Token was verified", 
        user,
    }).status(200);
};

const logout = async (req, res) => {
    res.clearCookie("accessToken");
    res.json({
        success: true,
        message: "Logged out successfully"
    }).status(200);
};

module.exports = {
    login,
    refresh,
    logout,
};
