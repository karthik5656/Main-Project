const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
    {
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        route: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Route",
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ['male', 'female', 'all'],
        },
        requests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Passenger",
                default: [],
            },
        ],
        passengers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Passenger",
                default: [],
            },
        ],
        source: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
        departureTime: {
            type: Date,
            required: true,
        },
        seatsAvailable: {
            type: Number,
            required: true,
        },
        active: {
            type: Boolean,
            required: true,
            default: true,
        }
    },
    { timestamps: true }
);

const Ride = mongoose.model("Ride", rideSchema);

module.exports = Ride;
