import { useEffect, useState } from "react";
import "../../styles/RideSearch.css";
import moment from "moment";
import axios from "axios";
import { locations } from "./constants";

const RideSearch = () => {
    const [alert, setAlert] = useState('Select filters to match rides according to your preferences')
    const [requestingAlert, setRequestingAlert] = useState('');
    const [rides, setRides] = useState([]);
    const [requestingIndex, setRequestingIndex] = useState(-1);
    const [filters, setFilters] = useState({
        gender: 'all',
        source: '',
        destination: '',
    });

    const requestRide = async (rideId) => {
        try {
            await axios.put("http://localhost:5000/rides/requestRide", { ...filters, rideId }, { withCredentials: true });
            setRequestingAlert('Ride request sent');
        } catch (err) {
            setRequestingAlert(err.response.data.message);
        }
    };

    const matchRides = async (event) => {
        event.preventDefault();
        if(filters.gender && filters.source && filters.gender) {
            try {
                const response = await axios.get('http://localhost:5000/rides/matchRides', {withCredentials: true, params: {...filters}});
                if(!response.data.rides.length) 
                    setAlert('No rides found');
                setRides(response.data.rides);
            } catch (err) {
                setAlert(err.response.data.message);
            }
        } else 
            setAlert('Select all the filters');
    };

    const updateFilters = async (event) => {
        setFilters({...filters, [event.target.name]: event.target.value});
    };

    useEffect(() => {
        setRequestingAlert('');
    }, [requestingIndex]);

    return (
        <div className="search-rides">
            <h1>Search Rides</h1>
            <div className="filters">
                <div className='filter'>
                    <label>Gender</label>
                    <select value={filters.gender} name='gender' onChange={updateFilters}>
                        <option value="all">All</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className='filter'>
                    <label>Source</label>
                    <select value={filters.source} name='source' onChange={updateFilters}>
                        <option value=''>Select</option>
                        {locations.map((location) => {
                            return (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className='filter'>
                    <label>Destination</label>
                    <select value={filters.destination} name='destination' onChange={updateFilters}>
                        <option value=''>Select</option>
                        {locations.map((location) => {
                            return (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
            <button onClick={matchRides}>Search</button>
            {rides.length === 0 && alert && <h3 className='alert'>{alert}</h3>}
            <ul className='searched-rides'>
                {rides.map((ride, i) => {
                    return (
                        <li key={ride._id} className='searched-ride'>
                            <p>
                                Driver <span>{ride.driver.username}</span>
                            </p>
                            <p>
                                Source <span>{ride.source}</span>
                            </p>
                            <p>
                                Destination <span>{ride.destination}</span>
                            </p>
                            <button onClick={() => setRequestingIndex(i)}>
                                Request
                            </button>
                            <div className={`backdrop ${requestingIndex === i ? 'show-backdrop' : ''}`}>
                                <div className='searched-ride searched-ride-requesting'>
                                    <h3>Request Ride</h3>
                                    <p>Driver <span>{ride.driver.username}</span></p>
                                    <p>Source <span>{ride.source}</span></p>
                                    <p>Destination <span>{ride.destination}</span></p>
                                    <div className='searched-ride-path'>
                                        <p>
                                            Path 
                                            {ride.route.path.map(location => {
                                                return <span key={location}>{location}</span>
                                            })}
                                        </p>
                                    </div>
                                    <p>Departure Time <span>{moment(ride.departureTime).format('LLL')}</span></p>
                                    <p>Total Seats <span>{ride.seatsAvailable}</span></p>
                                    <p>Current Passengers <span>{ride.passengers.length}</span></p>
                                    <p>Preferred Sharing Partner <span>{ride.gender}</span></p>
                                    {requestingAlert && <p style={{color: 'chartreuse', margin: 'auto'}}>{requestingAlert}</p>}
                                    <div className='searched-ride-actions'>
                                        <button onClick={() => requestRide(ride._id)}>
                                            Request
                                        </button>
                                        <button onClick={() => setRequestingIndex(-1)}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default RideSearch;