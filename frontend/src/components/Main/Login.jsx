import React, { useState } from "react";
import "../../styles/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {login} from '../../reducers/authSlice';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    const loginUser = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/auth/login", { user }, { withCredentials: true });
            dispatch(login({user: response.data.user}));
            navigate("/Profile");
        } catch (err) {
            console.log(err);
            setError(err.response.data.message);
        }
    };
    return (
        <div>
            <div className="login">
                <form method="POST">
                    <h2>LOGIN</h2>
                    <div className="login-detail">
                        <label for="email">Email</label>
                        <input
                            type="email"
                            onChange={(event) =>
                                setUser((prev) => {
                                    return {
                                        ...prev,
                                        username: event.target.value,
                                    };
                                })
                            }
                        />
                    </div>
                    <div className="login-detail">
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
                    {error && 
                        <p style={{color: 'red', fontSize: '0.85rem', margin: '0.75rem 0px', textAlign: 'center'}}>{error}</p>}
                    <div className="submit">
                        <button onClick={loginUser}>Login</button>
                    </div>
                    <div className="signup">
                        Don't have an account? <a href="/Register">Register</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
