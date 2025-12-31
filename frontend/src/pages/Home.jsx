import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  Users,
  TrendingUp,
  Zap,
  Shield
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-300 rounded-full opacity-20 blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-6xl mx-auto px-6 text-center"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
          >
            Manage Projects Smarter
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-xl mb-10 max-w-2xl mx-auto"
          >
            A modern project management platform to plan, track,
            and collaborate with your team seamlessly.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-4"
          >
            <Link
              to="/register"
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <span className="relative z-10">Start Free</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <Link
              to="/login"
              className="border-2 border-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-white hover:border-blue-500 hover:text-blue-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              Login
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Powerful Features</h2>
            <p className="text-gray-600 text-lg">Everything you need to manage projects efficiently</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <Feature icon={<LayoutDashboard />} title="Dashboard" desc="Overview of all projects and tasks in one place" delay={0.1} />
            <Feature icon={<ListChecks />} title="Task Control" desc="Create, assign, and update tasks easily" delay={0.2} />
            <Feature icon={<Users />} title="Team Work" desc="Collaborate with team members efficiently" delay={0.3} />
            <Feature icon={<TrendingUp />} title="Progress Tracking" desc="Track performance and completion rates" delay={0.4} />
            <Feature icon={<Zap />} title="Lightning Fast" desc="Built for speed and performance" delay={0.5} />
            <Feature icon={<Shield />} title="Secure" desc="Your data is safe and encrypted" delay={0.6} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

const Feature = ({ icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="relative p-8 border border-gray-200 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 group overflow-hidden"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity"
    />
    <motion.div 
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="text-blue-600 mb-4 p-3 bg-blue-100 rounded-lg inline-block"
    >
      {icon}
    </motion.div>
    <h3 className="font-bold text-xl mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </motion.div>
);

export default Home;
