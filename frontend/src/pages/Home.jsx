import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  Users,
  TrendingUp
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-gray-50 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-6 text-center"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Manage Projects Smarter
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            A modern project management platform to plan, track,
            and collaborate with your team.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Start Free
            </Link>
            <Link
              to="/login"
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <Feature icon={<LayoutDashboard />} title="Dashboard" desc="Overview of all projects and tasks" />
          <Feature icon={<ListChecks />} title="Task Control" desc="Create, assign, and update tasks easily" />
          <Feature icon={<Users />} title="Team Work" desc="Collaborate with team members efficiently" />
          <Feature icon={<TrendingUp />} title="Progress" desc="Track performance and completion rates" />
        </div>
      </section>

      <Footer />
    </>
  );
};

const Feature = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="p-6 border rounded-xl shadow-sm hover:shadow-md transition"
  >
    <div className="text-blue-600 mb-3">{icon}</div>
    <h3 className="font-semibold text-lg mb-1">{title}</h3>
    <p className="text-gray-500 text-sm">{desc}</p>
  </motion.div>
);

export default Home;
