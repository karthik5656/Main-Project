import React, { useEffect, useState } from "react";
import "../../styles/Profile.css";
import moment from 'moment';
import SharingPartner from "./SharingPartner";
import Ride from "./Ride";
import axios from "axios";
import { useSelector } from "react-redux";

const Profile = () => {
    const [previousRides, setPreviousRides] = useState([]);
    const [activeRide, setActiveRide] = useState({});
    const [sharedRides, setSharedRides] = useState([]);
    const {
        auth: { user },
    } = useSelector((state) => state);

    const getRide = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/rides/getActiveRide",
                {
                    withCredentials: true,
                }
            );
            if (response.data.ride) setActiveRide(response.data.ride);
        } catch (err) {
            console.log(err);
        }
    };

    const getPreviousRides = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/rides/getPreviousRides",
                {
                    withCredentials: true,
                }
            );
            setPreviousRides(response.data.rides);
        } catch (err) {
            console.log(err);
        }
    };

    const getSharedRides = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/rides/getSharedRides",
                {
                    withCredentials: true,
                }
            );
            setSharedRides(response.data.rides);
        } catch (err) {
            console.log(err);
        }
    };

    const logout = async () => {
        try {
            await axios.delete("http://localhost:5000/auth/logout", {
                withCredentials: true,
            });
            window.location.replace("/");
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getRide();
        getPreviousRides();
        getSharedRides();
    }, []);

    return (
        <div className="profile">
            <div className="profile-top">
                <div className="profilecontainer">
                    <img
                        src="https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                        alt=""
                    />
                    <div className="profile-details">
                        <div className="profile-detail">
                            <span>Name</span>
                            <p id="name">{user.username}</p>
                        </div>
                        <div className="profile-detail">
                            <span>DOB</span>
                            <p id="age">{user.dob}</p>
                        </div>
                        <div className="profile-detail">
                            <span>Phone Number</span>
                            <p id="ph_number">+91 {user.phone_no}</p>
                        </div>
                        <div className="profile-detail">
                            <span>Gender</span>
                            <p>{user.gender}</p>
                        </div>
                        <div className="profile-detail">
                            <span>Email ID</span>
                            <p id="email">{user.email}</p>
                        </div>
                        <button onClick={logout}>Logout</button>
                    </div>
                </div>
                <Ride {...{ activeRide, setActiveRide }} />
                <div className="previous">
                    <h2>Booked Rides</h2>
                    {sharedRides.length > 0 ? (
                        <table className="main">
                            <thead>
                                <tr>
                                    <th>Driver</th>
                                    <th>Contact</th>
                                    <th>Source</th>
                                    <th>Destination</th>
                                    <th>Pickup Point</th>
                                    <th>Drop Point</th>
                                    <th>Preferred Partner</th>
                                    <th>Departure Time</th>
                                    <th>Seats</th>
                                    <th>Passengers</th>
                                </tr>
                            </thead>
                            {sharedRides.map((sharedRide) => {
                                const passenger = sharedRide.passengers.find(passenger => passenger.user._id.toString() === user._id.toString());
                                return (
                                    <tbody key={sharedRide._id}>
                                        <tr>
                                            <td>{sharedRide.driver.username} ({sharedRide.driver.gender})</td>
                                            <td>{sharedRide.driver.phone_no}</td>
                                            <td>{sharedRide.source}</td>
                                            <td>{sharedRide.destination}</td>
                                            <td>{passenger.source}</td>
                                            <td>{passenger.destination}</td>
                                            <td>{sharedRide.gender}</td>
                                            <td>{moment(sharedRide.departureTime).format('LLL')}</td>
                                            <td>
                                                {sharedRide.seatsAvailable}
                                            </td>
                                            <td>
                                                {sharedRide.passengers.length}
                                            </td>
                                        </tr>
                                    </tbody>
                                );
                            })}
                        </table>
                    ) : (
                        <p className="empty-partners">No booked rides</p>
                    )}
                </div>
                {activeRide._id && (
                    <SharingPartner {...{ setActiveRide, activeRide }} />
                )}
                <div className="previous">
                    <h2>Previous Rides</h2>
                    {previousRides.length > 0 ? (
                        <table className="main">
                            <thead>
                                <tr>
                                    <th>Source</th>
                                    <th>Destination</th>
                                    <th>Preferred Partner</th>
                                    <th>Departure Time</th>
                                    <th>Seats</th>
                                    <th>Passengers</th>
                                </tr>
                            </thead>
                            {previousRides.map((previousRide) => {
                                return (
                                    <tbody key={previousRide._id}>
                                        <tr>
                                            <td>{previousRide.source}</td>
                                            <td>{previousRide.destination}</td>
                                            <td>{previousRide.gender}</td>
                                            <td>{moment(previousRide.departureTime).format('LLL')}</td>
                                            <td>
                                                {previousRide.seatsAvailable}
                                            </td>
                                            <td>
                                                {previousRide.passengers.length}
                                            </td>
                                        </tr>
                                    </tbody>
                                );
                            })}
                        </table>
                    ) : (
                        <p className="empty-partners">No previous rides</p>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Profile;
