const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    path: {
        type: Array,
        required: true,
    },
});

const Route = mongoose.model("Route", routeSchema);

module.exports = Route;