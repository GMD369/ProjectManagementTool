import React, { useState } from "react";
import api from "../../api/axios";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-lg w-96"
        >
          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-6">Login to your account</p>

          <div className="space-y-4">
            <Input icon={<Mail />} value={email} setValue={setEmail} placeholder="Email" />
            <Input icon={<Lock />} type="password" value={password} setValue={setPassword} placeholder="Password" />

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Login
            </button>

            <p className="text-sm text-center text-gray-500">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

const Input = ({ icon, value, setValue, placeholder, type = "text" }) => (
  <div className="flex items-center border rounded-lg px-3">
    <span className="text-gray-400">{icon}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2 outline-none"
    />
  </div>
);

export default Login;
