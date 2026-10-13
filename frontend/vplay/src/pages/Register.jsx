import { useState } from "react";
import api from "../api/axios";

export default function Register() {
  const [data, setData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError(""); // clear old errors

    const form = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null) form.append(key, data[key]);
    });

    try {
      const res = await api.post("/users/register", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res.data);
      alert("Registered successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg); // show error on page
    }
  };

  const fun = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form className="w-80 p-5 shadow bg-white" onSubmit={submit}>
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        {/* Show error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-2 mb-3 rounded">
            {error}
          </div>
        )}

        <input
          name="username"
          className="border w-full p-2 mb-3"
          placeholder="Username"
          onChange={fun}
        />

        <input
          name="fullName"
          className="border w-full p-2 mb-3"
          placeholder="Full Name"
          onChange={fun}
        />

        <input
          name="email"
          className="border w-full p-2 mb-3"
          placeholder="Email"
          onChange={fun}
        />

        <input
          name="password"
          type="password"
          className="border w-full p-2 mb-3"
          placeholder="Password"
          onChange={fun}
        />

        <label>Avatar</label>
        <input
          type="file"
          className="border w-full p-2 mb-3"
          onChange={(e) =>
            setData({ ...data, avatar: e.target.files[0] })
          }
        />

        <label>Cover Image</label>
        <input
          type="file"
          className="border w-full p-2 mb-3"
          onChange={(e) =>
            setData({ ...data, coverImage: e.target.files[0] })
          }
        />

        <button className="bg-green-600 w-full text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
