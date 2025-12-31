import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";
import { Mail, Lock, ArrowRight } from "lucide-react";
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
          onSubmit={handleLogin}
          className="relative bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Welcome Back</h2>
            <p className="text-gray-600 mb-8">Login to your account</p>
          </motion.div>

          <div className="space-y-5">
            <Input icon={<Mail />} value={email} setValue={setEmail} placeholder="Email" delay={0.3} />
            <Input icon={<Lock />} type="password" value={password} setValue={setPassword} placeholder="Password" delay={0.4} />

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2 group"
            >
              Login
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-center text-gray-600"
            >
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-purple-600 font-semibold hover:underline transition-colors">
                Register
              </Link>
            </motion.p>
          </div>
        </motion.form>
      </div>
    </>
  );
};

const Input = ({ icon, value, setValue, placeholder, type = "text", delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex items-center border-2 border-gray-200 rounded-lg px-4 focus-within:border-blue-500 transition-colors bg-white"
  >
    <span className="text-gray-400">{icon}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full p-3 outline-none bg-transparent"
    />
  </motion.div>
);

export default Login;
