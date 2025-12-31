import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background decoration */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full opacity-20 blur-3xl"
        />

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleRegister}
          className="relative bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Create Account</h2>
            <p className="text-gray-600 mb-8">Start managing your projects today</p>
          </motion.div>

          <div className="space-y-5">
            <Input icon={<User />} placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} delay={0.3} />
            <Input icon={<Mail />} placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} delay={0.4} />
            <Input icon={<Lock />} type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} delay={0.5} />

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2 group"
            >
              Register
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm text-center text-gray-600"
            >
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-purple-600 font-semibold hover:underline transition-colors">
                Login
              </Link>
            </motion.p>
          </div>
        </motion.form>
      </div>
    </>
  );
};

const Input = ({ icon, placeholder, type = "text", onChange, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex items-center border-2 border-gray-200 rounded-lg px-4 focus-within:border-blue-500 transition-colors bg-white"
  >
    <span className="text-gray-400">{icon}</span>
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full p-3 outline-none bg-transparent"
    />
  </motion.div>
);

export default Register;
