import React, { useState } from "react";
import api from "../../api/axios";
import { User, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    await api.post("/auth/register", form);
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleRegister}
          className="bg-white p-8 rounded-xl shadow-lg w-96"
        >
          <h2 className="text-2xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-500 mb-6">Start managing your projects</p>

          <div className="space-y-4">
            <Input icon={<User />} placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input icon={<Mail />} placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input icon={<Lock />} type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Register
            </button>

            <p className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

const Input = ({ icon, placeholder, type = "text", onChange }) => (
  <div className="flex items-center border rounded-lg px-3">
    <span className="text-gray-400">{icon}</span>
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full p-2 outline-none"
    />
  </div>
);

export default Register;
