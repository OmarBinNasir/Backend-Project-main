import { useState } from "react";
import api from "../api/axios";
import { Navigate } from "react-router-dom";

export default function Login() {
    const [data, setData] = useState({
        email: "", password: "", username: ""
    });

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/users/login", data);
            alert("Login successful!");
            console.log(res.data);
            Navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <form className="w-80 p-5 shadow bg-white" onSubmit={submit}>
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                <input
                    type="name"
                    name="username"
                    placeholder="Username"
                    className="border w-full p-2 mb-3"
                    onChange={(e) => setData({ ...data, username: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="border w-full p-2 mb-3"
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border w-full p-2 mb-3"
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                />

                <button className="bg-blue-600 w-full text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}
