import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import {FaBell} from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../../styles/Navbar.css";
import moment from 'moment';

const links = [
    {
        id: 1,
        title: "Home",
        to: "/",
        isLoggedIn: true,
        isNotLoggedIn: true 
    },
    {
        id: 2,
        title: "Login",
        to: "/login",
        isLoggedIn: false,
        isNotLoggedIn: true,
    },
    {
        id: 3,
        title: "Register",
        to: "/register",
        isLoggedIn: false,
        isNotLoggedIn: true,
    },
    {
        id: 4,
        title: "Search Rides",
        to: "/search",
        isLoggedIn: true,
        isNotLoggedIn: false,
    },
    {
        id: 5,
        title: "Profile",
        to: "/profile",
        isLoggedIn: true,
        isNotLoggedIn: false,
    },
];

const Navbar = () => {
    const {
        auth: { isLoggedIn },
    } = useSelector((state) => state);
    const [isDevice, setIsDevice] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const getNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users/getNotifications', {withCredentials: true});
            setNotifications(response.data.notifications);
        } catch (err) {
            console.log(err);
        }
    };

    const markNotificationsSeen = async () => {
        try {
            const response = await axios.put('http://localhost:5000/users/markNotificationsSeen', {}, {withCredentials: true});
            setNotifications(response.data.notifications);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if(showNotifications) 
            setTimeout(markNotificationsSeen, 3000);
    }, [showNotifications]);

    useEffect(() => {
        let interval;
        if(isLoggedIn) {
            getNotifications();
            interval = setInterval(getNotifications, 1000 * 1 * 60);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isLoggedIn]);

    return (
        <header>
            <nav>
                <div className="logo">
                    <p>Book-A-Ride</p>
                </div>
                <div>
                    <ul
                        className={isDevice ? "navlinks-device" : "navlinks"}
                        onClick={() => setIsDevice(false)}
                    >
                        {links.map((link) => {
                            if (
                                (isLoggedIn && !link.isLoggedIn) ||
                                (!isLoggedIn && !link.isNotLoggedIn)
                            )
                                return <Fragment key={link.id}></Fragment>;
                            return (
                                <li key={link.id}>
                                    <Link to={link.to}>{link.title}</Link>
                                </li>
                            );
                        })}
                        {isLoggedIn && 
                            <li className='notifications-container'>
                                <FaBell onClick={() => setShowNotifications(_ => !_)}/>
                                {notifications.find(notification => !notification.seen) && <div className='unseen'></div>}
                                <div className={`notifications ${showNotifications ? 'show-notifications' : ''}`}>
                                    {notifications.length
                                        ?
                                        <div className='notification-list'>
                                            {notifications.map(notification => {
                                                return (
                                                    <div className='notification' style={notification.seen ? {} : {backgroundColor: 'black'}}>
                                                        <Link to='/profile' >{notification.text}</Link>
                                                        <span style={{fontsize: '0.8rem', color: 'white'}}>{moment(notification.createdAt).fromNow()}</span>
                                                    </div>
                                                );
                                            })}
                                            
                                        </div>
                                        :
                                        <p style={{fontSize: '1rem', color: 'white', fontWeight: 'bold'}}>No new notifications</p>}
                                </div>
                            </li>
                        }
                    </ul>
                </div>
                <button
                    className="responsive"
                    onClick={() => setIsDevice(!isDevice)}
                >
                    {isDevice ? (
                        <i className="fas fa-times"></i>
                    ) : (
                        <i className="fas fa-bars"></i>
                    )}
                </button>
            </nav>
        </header>
    );
};
export default Navbar;
