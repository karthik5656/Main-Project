import React, { useState, useEffect } from "react";
import "../../styles/Register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState('');
    const [user, setUser] = useState({
        name: "",
        phoneNumber: "",
        dob: "",
        email: "",
        password: "",
        gender: "Male",
    });

    const registerUser = async (event) => {
        event.preventDefault();
        try {
            await axios
                .post("http://localhost:5000/users", { user })
                .then((res) => {
                    if (res.status === 200) 
                        navigate("/login");
                });
            setAlert('Registered, login to continue');
        } catch (err) {
            setAlert(err.response.data.message);
            console.log(err);
        }
    };

    useEffect(() => {
        if(alert) {
            setTimeout(() => {
                setAlert('');
            }, 3000);
        }
    }, [alert]);

    return (
        <div>
            {alert && 
            <div className="error">
                <span>{alert}</span>
            </div>}
            <div className="register">
                <form method="POST">
                    <h2>SIGN UP</h2>
                    <div className="register-detail">
                        <label for="name">Name</label>
                        <input
                            type="text"
                            onChange={(event) =>
                                setUser((prev) => {
                                    return {
                                        ...prev,
                                        name: event.target.value,
                                    };
                                })
                            }
                        />
                    </div>
                    <div className="register-detail">
                        <label for="number">Phone Number</label>
                        <input
                            type="number"
                            onChange={(event) =>
                                setUser((prev) => {
                                    return {
                                        ...prev,
                                        phoneNumber: event.target.value,
                                    };
                                })
                            }
                        />
                    </div>
                    <div className="register-detail">
                        <label for="date">Date of Birth</label>
                        <input
                            type="date"
                            onChange={(event) =>
                                setUser((prev) => {
                                    return { ...prev, dob: event.target.value };
                                })
                            }
                        />
                    </div>
                    <div className="register-detail">
                        <label for="email">Email</label>
                        <input
                            type="email"
                            onChange={(event) =>
                                setUser((prev) => {
                                    return {
                                        ...prev,
                                        email: event.target.value,
                                    };
                                })
                            }
                        />
                    </div>
                    <div className="register-detail">
                        <label for="password">Password</label>
                        <input
                            type="password"
                            onChange={(event) =>
                                setUser((prev) => {
                                    return {
                                        ...prev,
                                        password: event.target.value,
                                    };
                                })
                            }
                        />
                    </div>
                    <div className="register-detail">
                        <label for="gender">Gender</label>
                        <select>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="submit">
                        <button onClick={registerUser}>Register</button>
                    </div>
                    <div className="member">
                        Already Registered? <a href="/login">Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
