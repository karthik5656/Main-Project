const Ride = require('../schema/rideSchema');

const inactivateRides = async () => {
    const rides = await Ride.find({
        active: true,
        departureTime: {$lte: new Date().toISOString()}
    });
    for(const ride of rides) {
        ride.active = false;
        await ride.save();
    }
};

module.exports = {inactivateRides};