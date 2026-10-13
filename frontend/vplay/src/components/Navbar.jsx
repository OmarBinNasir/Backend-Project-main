import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Navbar() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        api.post("/users/get-user")
            .then((res) => setUsername(res.data.data.username))
            .catch(() => setUsername(""));
    }, []);

    const logout = async () => {
        try {
            await api.post("/users/logout");
            setUsername("");
            navigate("/login");      // redirect user to login
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex justify-between items-center p-4 shadow ">
            <Link to="/" className="text-xl font-bold">VPLAY</Link>

            <div className="flex gap-4 items-center ">

                {/* Upload only if logged in */}
                { username && <Link to="/">Home</Link> }
                {username && <Link to="/upload">Upload</Link>}

                {/* Profile or Login/Register */}
                {username ? (
                    <>
                        <Link to={`/profile/${username}`}>Profile</Link>

                        {/* LOGOUT BUTTON */}
                        <button
                            onClick={logout}
                            className="text-white rounded-lg p-2 bg-red-700"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </div>
    );
}
