const { Router } = require("express");
const {
    getNotifications,
    markNotificationsSeen,
    getUser,
    createUser,
    deleteUser,
    updateUser,
} = require("../controllers/userController");
const { verifyAccessToken } = require("../utils/auth");

const router = Router();

router.get('/getNotifications', verifyAccessToken, getNotifications);

router.put('/markNotificationsSeen', verifyAccessToken, markNotificationsSeen);

router.get("/:_id", getUser);

router.post("/", createUser);

router.put("/:_id", verifyAccessToken, updateUser);

router.delete("/:_id", verifyAccessToken, deleteUser);

module.exports = router;
