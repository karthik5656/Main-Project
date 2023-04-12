const { Router } = require("express");
const {
    createRide,
    requestRide,
    getActiveRide,
    matchRides,
    acceptRideRequest,
    getPreviousRides,
    getSharedRides,
    cancelRide,
} = require("../controllers/rideController.js");
const { verifyAccessToken } = require("../utils/auth");

const router = Router();

router.get("/matchRides", verifyAccessToken, matchRides);

router.get("/getPreviousRides", verifyAccessToken, getPreviousRides);

router.get('/getSharedRides', verifyAccessToken, getSharedRides);

router.post("/createRide", verifyAccessToken, createRide);

router.put("/requestRide", verifyAccessToken, requestRide);

router.put("/acceptRideRequest", verifyAccessToken, acceptRideRequest);

router.get("/getActiveRide", verifyAccessToken, getActiveRide);

router.delete('/cancelRide', verifyAccessToken, cancelRide);

module.exports = router;