const Ride = require("../schema/rideSchema");
const User = require("../schema/userSchema");
const Notification = require('../schema/notificationSchema');
const Passenger = require('../schema/passengerSchema');
const Route = require('../schema/routeSchema');
const {travelRoute, bfs} = require('../utils/graph');

const getActiveRide = async (req, res) => {
    const ride = await Ride.findOne({
        driver: req.user._id, 
        active: true
    })
    .populate({ 
        path: 'passengers',
        populate: {
          path: 'user',
          model: 'User'
        } 
     })
     .populate({ 
        path: 'requests',
        populate: {
          path: 'user',
          model: 'User'
        } 
     })
    .populate('route');
    res.json({success: true, ride});
};

const getPreviousRides = async (req, res) => {
    const rides = await Ride.find({
        driver: req.user._id, 
        active: false
    })
    res.json({success: true, rides});
};

const getSharedRides = async (req, res) => {
    const passengers = await Passenger.find({user: req.user._id}).exec();
    let rides = [];
    for(let i = 0; i < passengers.length; ++i) {
        const passengerRides = await Ride.find({
            passengers: {$all: [passengers[i].id]}, 
            active: true
        })
        .populate({ 
            path: 'passengers',
            populate: {
            path: 'user',
            model: 'User'
            } 
        })
        .populate('driver')
        .populate('route')
        .exec();
        rides = [...rides, ...passengerRides];
    }
    res.json({success: true, rides});
};

const matchRides = async (req, res) => {
    const {source, destination, gender} = req.query;
    if(!source || !destination || !gender) 
        return res.status(400).json({success: false, message: "Provide all the filters"});
    if(source === destination) 
        return res.status(400).json({success: false, message: "Source and destination cannot be the same"});
    const routes = await Route.find({path: {$all: [source, destination]}}).exec();
    let matchedRides = [];
    for(let i = 0; i < routes.length; ++i) {
        const rides = await Ride.find({route: routes[i].id, active: true}).populate('driver').populate('route').exec();;
        for(const ride of rides) {
            if(ride.driver._id.toString() !== req.user._id.toString() && ride.passengers.length < ride.seatsAvailable) {
                if((ride.gender === 'all' || ride.gender === req.user.gender.toLowerCase()) && (gender === 'all' || gender === ride.driver.gender.toLowerCase())) 
                    matchedRides.push(ride);
            }
        }
    }
    return res.json({success: true, rides: matchedRides});
};

const createRide = async (req, res) => {
    console.log(req.body.ride, travelRoute);
    if(req.body.ride.source === req.body.ride.destination) 
        return res.status(400).json({success: false, message: "Source and destination cannot be the same"});
    if(!travelRoute[req.body.ride.source] || !travelRoute[req.body.ride.destination]) 
        return res.status(400).json({success: false, message: "Invalid source or destination"});
    if(await Ride.countDocuments({active: true, driver: req.user._id})) 
        return res.status(400).json({success: false, message: "A ride is already active"});
    if(new Date(req.body.ride.dateTime) <= new Date()) 
        return res.status(400).json({success: false, message: "Invalid date time"});
    let route = await Route.findOne({source: req.body.ride.source, destination: req.body.ride.destination});
    if(!route) {
        const path = bfs(req.body.ride.source, req.body.ride.destination)
        route = new Route({
            source: req.body.ride.source,
            destination: req.body.ride.destination,
            path
        });
        route = await route.save();
    }
    let newRide = new Ride({
        driver: req.user._id,
        gender: req.body.ride.partner.toLowerCase(),
        source: req.body.ride.source,
        destination: req.body.ride.destination,
        departureTime: req.body.ride.dateTime,
        seatsAvailable: req.body.ride.seats,
        route: route.id,
    });
    try {
        await newRide.save();
        newRide = await Ride.findOne({
            driver: req.user._id, 
            active: true
        })
        .populate({ 
            path: 'passengers',
            populate: {
              path: 'user',
              model: 'User'
            } 
        })
         .populate({ 
            path: 'requests',
            populate: {
              path: 'user',
              model: 'User'
            } 
        })
        .populate('route');
        res.json({success: true, ride: newRide});
    } catch (err) {
        res.status(400).json({success: false, message: "Invalid ride details"});
    }
};

const cancelRide = async (req, res) => {
    let ride = await Ride.findOne({driver: req.user._id, active: true})
    .populate({ 
        path: 'passengers',
        populate: {
          path: 'user',
          model: 'User'
        } 
     })
     .populate({ 
        path: 'requests',
        populate: {
          path: 'user',
          model: 'User'
        } 
     }).exec();
    const deletedRide = ride;
    if(!ride) 
        return res.status(400).json({success: false, message: "No active ride"});
    await ride.delete();
    for(let i = 0; i < deletedRide.passengers.length; ++i) {
        const notification = new Notification({
            user: deletedRide.passengers[i].user._id, 
            text: `Ride cancelled by ${req.user.username}`
        });
        notification.save();
    }
    for(let i = 0; i < deletedRide.requests.length; ++i) {
        const notification = new Notification({
            user: deletedRide.requests[i].user._id, 
            text: `Ride cancelled by ${req.user.username}`
        });
        notification.save();
    }
    res.json({success: true});
};

const requestRide = async (req, res) => {
    const {source, destination, rideId} = req.body;
    const ride = await Ride.findById(rideId).populate('requests').populate('passengers').exec();
    if(!ride) 
        return res.status(400).json({success: false, message: "Invalid ride ID"});
    if(source === destination) 
        return res.status(400).json({success: false, message: "Source and destination cannot be the same"});
    if(!travelRoute[source] || !travelRoute[destination]) 
        return res.status(400).json({success: false, message: "Invalid source or destination"});
    if(ride.passengers.length === ride.seatsAvailable) 
        return res.status(400).json({success: false, message: "Ride is full"});
    if(ride.driver.toString() === req.user._id.toString()) 
        return res.status(400).json({success: false, message: "Cannot request your own ride"});
    if(ride.requests.find(request => request.user.toString() === req.user._id.toString())) 
        return res.status(400).json({success: false, message: "Already requested"});
    if(ride.passengers.find(passenger => passenger.user.toString() === req.user._id.toString())) 
        return res.status(400).json({success: false, message: "Already a passenger"});
    let request = new Passenger({user: req.user._id, source, destination});
    request = await request.save();
    ride.requests.push(request._id);
    ride.markModified('requests')
    await ride.save();
    const notification = new Notification({user: ride.driver, text: `Request for ride sharing received from ${req.user.username}`});
    notification.save();
    return res.json({success: true});
};

const acceptRideRequest = async (req, res) => {
    const {requestId} = req.body;
    let ride = await Ride.findOne({driver: req.user._id, active: true}).exec();
    if(!ride) 
        return res.status(400).json({success: false, message: "No active ride"});
    if(!ride.requests.find(request => request.toString() === requestId)) 
        return res.status(400).json({success: false, message: "No request received"});
    if(ride.passengers.length === ride.seatsAvailable) 
        return res.status(400).json({success: false, message: "Ride is full"});
    ride.requests = ride.requests.filter(request => request.toString() !== requestId);
    ride.passengers.push(requestId);
    ride.markModified('requests')
    ride.markModified('passengers')
    ride = await ride.save();
    ride = await Ride.findOne({
        driver: req.user._id, 
        active: true
    })
    .populate({ 
        path: 'passengers',
        populate: {
          path: 'user',
          model: 'User'
        } 
     })
     .populate({ 
        path: 'requests',
        populate: {
          path: 'user',
          model: 'User'
        } 
     })
    .populate('route');
    const notification = new Notification({
        user: ride.passengers[ride.passengers.length - 1].user._id, 
        text: `Request for ride accepted by ${req.user.username}`
    });
    notification.save();
    return res.json({success: true, ride});
};

module.exports = { getSharedRides, createRide, requestRide, getActiveRide, matchRides, acceptRideRequest, getPreviousRides, cancelRide };
