import { useState } from "react";
import "../../styles/Ride.css";
import moment from 'moment';
import axios from "axios";

const Ride = ({activeRide, setActiveRide}) => {
    const [alert, setAlert] = useState('');
    const [ride, setRide] = useState({
        source: "",
        destination: "",
        vehicle: "taxi",
        seats: "",
        partner: "",
        dateTime: "",
    });

    const createRide = async (event) => {
        event.preventDefault();
        if (!activeRide._id) {
            try {
                const response = await axios.post("http://localhost:5000/rides/createRide",
                    { ride },
                    { withCredentials: true }
                );
                setActiveRide(response.data.ride);
                setAlert('');
                setRide({
                    source: "",
                    destination: "",
                    vehicle: "taxi",
                    seats: "",
                    partner: "",
                    dateTime: "",
                });
            } catch (err) {
                setAlert(err.response?.data?.message || 'Invalid details');
            }
        }
    };

    const cancelRide = async (event) => {
        event.preventDefault();
        if(activeRide._id) {
            try {
                await axios.delete("http://localhost:5000/rides/cancelRide", { withCredentials: true });
                setActiveRide({});
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div className="container">
            <form>
                <h2 id="RideHeader">Add New Ride</h2>
                <div className="add-ride-detail">
                    <label for="source">Source</label>
                    <input
                        type="text"
                        onChange={(event) => {
                            setRide((prev) => {
                                return {
                                    ...prev,
                                    source: event.target.value,
                                };
                            });
                        }}
                    />
                </div>
                <div className="add-ride-detail">
                    <label for="destination">Destination</label>
                    <input
                        type="text"
                        onChange={(event) => {
                            setRide((prev) => {
                                return {
                                    ...prev,
                                    destination: event.target.value,
                                };
                            });
                        }}
                    />
                </div>
                <div className="add-ride-detail">
                    <label for="no of seats">Number of Seats</label>
                    <input
                        type="number"
                        onChange={(event) => {
                            setRide((prev) => {
                                return {
                                    ...prev,
                                    seats: event.target.value,
                                };
                            });
                        }}
                    ></input>
                </div>
                <div className="add-ride-detail">
                    <label for="dateTime">Date and Time</label>
                    <input
                        type="datetime-local"
                        onChange={(event) => {
                            setRide((prev) => {
                                return {
                                    ...prev,
                                    dateTime: event.target.value,
                                };
                            });
                        }}
                    ></input>
                </div>
                <div className="add-ride-radio">
                    <label for="sharing">Choose your sharing partner</label>
                    <div className="add-ride-radio-options">
                        <input
                            type="radio"
                            id="male"
                            value="male"
                            checked={ride.partner === "male"}
                            onChange={(event) => {
                                setRide((prev) => {
                                    return {
                                        ...prev,
                                        partner: event.target.value,
                                    };
                                });
                            }}
                        />
                        <label for="male">Male</label>
                        <input
                            type="radio"
                            id="female"
                            value="female"
                            checked={ride.partner === "female"}
                            onChange={(event) => {
                                setRide((prev) => {
                                    return {
                                        ...prev,
                                        partner: event.target.value,
                                    };
                                });
                            }}
                        />
                        <label for="female">Female</label>
                        <input
                            type="radio"
                            id="all"
                            value="all"
                            checked={ride.partner === "all"}
                            onChange={(event) => {
                                setRide((prev) => {
                                    return {
                                        ...prev,
                                        partner: event.target.value,
                                    };
                                });
                            }}
                        />
                        <label for="all">All</label>
                    </div>
                </div>
                {alert && <p className='alert' style={{color: 'red', textAlign: 'center', fontSize: '0.9rem'}}>{alert}</p>}
                <div className="submit">
                    <button onClick={createRide}>Add</button>
                </div>
            </form>
            {activeRide._id ? (
                <div className="card">
                    <h2>Active Ride</h2>
                    <div className="currentride">
                        <p>
                            Source <span>{activeRide.source}</span>
                        </p>
                        <p>
                            Destination{" "}
                            <span>{activeRide.destination}</span>
                        </p>
                        <p>
                            Path 
                            {activeRide.route.path.map(location => {
                                return <span key={location}>{location}</span>
                            })}
                        </p>
                        <p>
                            Departure Time{" "}
                            <span>{moment(activeRide.departureTime).format('LLL')}</span>
                        </p>
                        <p>
                            Number of Seats{" "}
                            <span>{activeRide.seatsAvailable}</span>
                        </p>
                        <p>
                            Current Passengers <span>{activeRide.passengers.length}</span>
                        </p>
                        <p>
                            Preferred Sharing Partner{" "}
                            <span>{activeRide.gender}</span>
                        </p>
                        <p>
                            <a href="#sharing_partners">
                                View sharing partners
                            </a>
                        </p>
                        <button onClick={cancelRide} style={{backgroundColor: 'red', color: 'white'}}>Cancel Ride</button>
                    </div>
                </div>
            ) : (
                <h1 style={{ color: "white" }}>No active ride</h1>
            )}
        </div>
    );
};
export default Ride;
