const User = require("../schema/userSchema");
const { hashPassword } = require("../utils/auth");
const Notification = require("../schema/notificationSchema");

const getUser = async (req, res) => {
    const {_id} = req.params;
    const user = await User.findById(_id);
    if(!user) 
        return res.status(404).json({ success: false, message: "Invalid user ID" });
    res.json({ success: true, user });
};

const createUser = async (req, res) => {
    const {user} = req.body
    const password = user.password;
    const hashedPassword = await hashPassword(password);
    if(await User.findOne({email: user.email})) 
        return res.status(400).json({success: false, message: "User already exists"})
    try {
        let newUser = new User({
            username: user.name,
            password: hashedPassword,
            dob: user.dob,
            phone_no: user.phoneNumber,
            age: user.age,
            email: user.email,
            gender: user.gender,
        });
        newUser = await newUser.save();
        return res.status(201).json({success: true, message: 'User created', user: newUser});
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, message: 'Invalid details provided'});
    }
};

const updateUser = (req, res) => {
    try {
        const updateuser = User.findbyIDandupdate(req.params._id);
        res.status(200).json(saveduser);
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteUser = (req, res) => {
    res.json({success: true});
};

const getNotifications = async (req, res) => {
    const {_id} = req.user;
    const notifications = await Notification.find({user: _id});
    res.json({success: true, notifications});
};

const markNotificationsSeen = async (req, res) => {
    const {_id} = req.user;
    console.log(_id);
    let notifications = await Notification.find({user: _id, seen: false});
    for(let i = 0; i < notifications.length; ++i) {
        notifications[i].seen = true;
        await notifications[i].save();
    }
    notifications = await Notification.find({user: _id});
    console.log('marked')
    res.json({success: true, notifications});
};

module.exports = { createUser, updateUser, getUser, deleteUser, getNotifications, markNotificationsSeen };