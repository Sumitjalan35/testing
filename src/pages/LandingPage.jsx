import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, Users, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-primary-600" />,
      title: "AI-Powered Analysis",
      description: "Get personalized career recommendations based on your profile and goals"
    },
    {
      icon: <Target className="w-8 h-8 text-primary-600" />,
      title: "Goal-Oriented Planning",
      description: "Create actionable career plans tailored to your aspirations"
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: "Expert Guidance",
      description: "Access professional career counseling and industry insights"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary-600" />,
      title: "Growth Tracking",
      description: "Monitor your progress and skill development over time"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <Brain className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-secondary-800">CareerAI</span>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="btn-primary"
            onClick={() => navigate('/profile-setup')}
          >
            Get Started
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 py-20"
      >
        <div className="text-center">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Powered by Advanced AI Technology</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-secondary-800 mb-6 leading-tight"
          >
            Find the Best
            <span className="block bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Career Path
            </span>
            for You with AI Counsellor
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Discover your ideal career path with our AI-powered career counselor. 
            Get personalized recommendations, skill assessments, and actionable insights 
            to accelerate your professional growth.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
              onClick={() => navigate('/profile-setup')}
            >
              <span>Find Your Career Path</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-8 py-4"
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-800 mb-4">
            Why Choose CareerAI?
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI technology with expert career guidance 
            to help you make informed decisions about your future.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="card text-center group hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-secondary-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20"
      >
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who have found their dream careers with CareerAI.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-lg text-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => navigate('/profile-setup')}
          >
            Start Your Journey Today
          </motion.button>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-secondary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="w-6 h-6" />
            <span className="text-xl font-bold">CareerAI</span>
          </div>
          <p className="text-secondary-300">
            © 2024 CareerAI. All rights reserved. Empowering careers with AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
