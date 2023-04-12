import "../../styles/SharingPartner.css";

import axios from 'axios';

const SharingPartner = ({ activeRide, setActiveRide }) => {

    const acceptRideRequest = async (requestId) => {
        try {
            const response = await axios.put('http://localhost:5000/rides/acceptRideRequest', {requestId}, {withCredentials: true});
            setActiveRide(response.data.ride);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="sharing-partners-container" id="sharing_partners">
            <h2>Sharing Partners</h2>
            <div className="sharing-partners">
                {activeRide.passengers && activeRide.passengers.length > 0 ? (
                    <table className="main">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Contact</th>
                                <th>Source</th>
                                <th>Destination</th>
                            </tr>
                        </thead>
                        {activeRide.passengers.map((passenger) => {
                            return (
                                <tbody key={passenger._id}>
                                    <tr>
                                        <td>{passenger.user.username}</td>
                                        <td>{passenger.user.gender}</td>
                                        <td>{passenger.user.phone_no}</td>
                                        <td>{passenger.source}</td>
                                        <td>{passenger.destination}</td>
                                    </tr>
                                </tbody>
                            );
                        })}
                    </table>
                ) : (
                    <p className="empty-partners">No partners yet</p>
                )}
            </div>
            <h2>Requests</h2>
            <div className="sharing-partners" id="sharing-partners">
                {activeRide.requests && activeRide.requests.length > 0 ? (
                    <table className="main">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Contact</th>
                                <th>Source</th>
                                <th>Destination</th>
                                <th></th>
                            </tr>
                        </thead>
                        {activeRide.requests.map((request) => {
                            return (
                                <tbody key={request._id}>
                                    <tr>
                                        <td>{request.user.username}</td>
                                        <td>{request.user.gender}</td>
                                        <td>{request.user.phone_no}</td>
                                        <td>{request.source}</td>
                                        <td>{request.destination}</td>
                                        <td>
                                            <button onClick={() => acceptRideRequest(request._id.toString())}>Accept</button>
                                        </td>
                                    </tr>
                                </tbody>
                            );
                        })}
                    </table>
                ) : (
                    <p className="empty-partners">No requests yet</p>
                )}
            </div>
        </div>
    );
};

export default SharingPartner;
