import { Link } from "react-router-dom";
import { CheckCircle2, Users, BarChart3, Clock, Zap, Shield } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <BarChart3 className="text-indigo-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-white">ProjectHub</span>
            </div>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-6 py-2 text-white hover:text-white/80 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-white text-indigo-600 rounded-lg hover:bg-white/90 font-medium transition-all shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Manage Projects
              <br />
              <span className="text-blue-200">Like a Pro</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
              Streamline your workflow, collaborate seamlessly, and deliver projects on time.
              The ultimate project management solution for modern teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-white/90 transition-all font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all font-semibold text-lg border-2 border-white/30"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features to help you manage projects efficiently and boost team productivity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 size={32} />}
              title="Real-time Dashboard"
              description="Get instant insights into project progress, team performance, and upcoming deadlines with beautiful visualizations."
              gradient="from-blue-500 to-indigo-600"
            />
            <FeatureCard
              icon={<CheckCircle2 size={32} />}
              title="Task Management"
              description="Create, assign, and track tasks effortlessly. Set priorities, deadlines, and monitor completion status."
              gradient="from-purple-500 to-pink-600"
            />
            <FeatureCard
              icon={<Users size={32} />}
              title="Team Collaboration"
              description="Work together seamlessly with real-time updates, shared workspaces, and instant communication."
              gradient="from-green-500 to-teal-600"
            />
            <FeatureCard
              icon={<Clock size={32} />}
              title="Time Tracking"
              description="Monitor time spent on tasks and projects. Generate detailed reports for better resource allocation."
              gradient="from-orange-500 to-red-600"
            />
            <FeatureCard
              icon={<Zap size={32} />}
              title="Automation"
              description="Automate repetitive tasks and workflows. Save time and reduce manual errors with smart automation."
              gradient="from-yellow-500 to-orange-600"
            />
            <FeatureCard
              icon={<Shield size={32} />}
              title="Secure & Reliable"
              description="Enterprise-grade security with role-based access control. Your data is always safe and protected."
              gradient="from-indigo-500 to-purple-600"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of teams already using ProjectHub to manage their projects efficiently
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-xl hover:bg-white/90 transition-all font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <BarChart3 className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold">ProjectHub</span>
            </div>
            <p className="text-gray-400 mb-4">
              The ultimate project management solution for modern teams
            </p>
            <p className="text-gray-500 text-sm">
              © 2026 ProjectHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, gradient }) => (
  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
    <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default Home;
