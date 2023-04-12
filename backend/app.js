require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./app/routers/userRouter");
const ridesRouter = require("./app/routers/ridesRouter");
const authRouter = require("./app/routers/authRouter");
const {inactivateRides} = require('./app/utils');

/* central server setup */

const app = express();
const port = process.env.PORT || 5000;

/* middlewares */

app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        origin: [
            "https://note-maker-assessment.vercel.app",
            "http://localhost:3000",
        ],
        credentials: true,
        sameSite: "None",
        secure: true,
    })
);

/* mongodb database connection */

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(
    /* 
    Replace "mongodb cluster url"
    with your mongoDB cluster URI in this format

    `mongodb+srv://<username>:<password>@<host>/<db_name>?retryWrites=true&w=majority`

    */
    "mongodb+srv://billafy:billafy@mern-cluster.itf9r.mongodb.net/rides?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

mongoose.connection.on("error", () => {
    console.log("Error connecting to database");
});
mongoose.connection.on("open", () => {
    console.log("Connected to database");
});

/* api */

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/rides", ridesRouter);

inactivateRides();
setInterval(() => {
    inactivateRides();
}, 60 * 1000);

/* making the app listen to a port */

const server = app.listen(port, () => {
    console.log(`App listening port ${port}`);
});
