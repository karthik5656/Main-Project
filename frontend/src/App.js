import {useEffect} from "react";
import "./App.css";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Main/Navbar";
import Home from "./components/Main/Home";
import Login from "./components/Main/Login";
import Register from "./components/Main/Register";
import Profile from "./components/User/Profile";
import RideSearch from "./components/User/RideSearch";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./reducers/authSlice";

function App() {
    const {auth: {isLoggedIn}} = useSelector(state => state);
    const dispatch = useDispatch();

    const refresh = async () => {
        try {
            const response = await axios.put('http://localhost:5000/auth/refresh', {}, {withCredentials: true});
            console.log(response.data.user);
            dispatch(login({user: response.data.user}));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if(!isLoggedIn) 
            refresh();
    }, []);

    return (
        <div>
            <BrowserRouter>
                <Navbar/>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to='/'/>}></Route>
                    <Route path="/search" element={isLoggedIn ? <RideSearch/> : <Navigate to='/login'/>}></Route>
                    <Route path="/" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
