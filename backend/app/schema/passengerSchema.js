const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        source: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Passenger = mongoose.model("Passenger", passengerSchema);

module.exports = Passenger;
