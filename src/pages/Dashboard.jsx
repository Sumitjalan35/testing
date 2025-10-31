import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCareer } from '../contexts/CareerContext';
import apiService from '../services/api';
import CareerAdviceDisplay from '../components/CareerAdviceDisplay';
import SkillGapAnalysis from '../components/SkillGapAnalysis';
import { 
  Menu, X, User, Brain, Target, TrendingUp, BookOpen, 
  MessageCircle, FileText, Users, Award, Calendar,
  ChevronRight, Star, BarChart3, Lightbulb, Loader2, Clock, MapPin
} from 'lucide-react';

// Job Details Card Component
const JobDetailsCard = ({ jobTitle, matchScore }) => {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobTitle) return;
      
      setLoading(true);
      try {
        const response = await fetch('/api/job-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ job_title: jobTitle }),
        });

        if (response.ok) {
          const data = await response.json();
          setJobDetails(data);
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobTitle]);

  if (loading) {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="col-span-3 flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="text-gray-600 font-medium">Generating job details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg">Role Description</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Entry-level role involving coding, testing, and learning new technologies under mentorship.
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg">Day in the Life</h3>
          </div>
          <ul className="text-gray-600 text-sm space-y-2">
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Morning standup meetings</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Code development and review</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Team collaboration sessions</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Problem-solving and debugging</span>
            </li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg">Match Details</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(matchScore * 100)}%` }}
              ></div>
            </div>
            <span className="text-gray-700 font-semibold text-sm">{(matchScore * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">Role Description</h3>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">
          {jobDetails.job_description}
        </p>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">Day in the Life</h3>
        </div>
        <ul className="text-gray-600 text-sm space-y-2">
          {jobDetails.day_in_life.map((point, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-800 text-lg">Match Details</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(matchScore * 100)}%` }}
            ></div>
          </div>
          <span className="text-gray-700 font-semibold text-sm">{(matchScore * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { userProfile, aiAdvice, userType, jobMatches, updateJobMatches } = useCareer();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'career-explorer', label: 'Career Explorer', icon: Target },
    { id: 'ai-toolkit', label: 'AI Toolkit', icon: Brain },
    { id: 'skill-gap-analysis', label: 'Skill Gap Analysis', icon: TrendingUp }
  ];

  // Fetch job matches automatically based on profile data
  useEffect(() => {
    const fetchMatches = async () => {
      if (!userProfile) return;
      if (jobMatches && jobMatches.length > 0) return;
      try {
        const skills = Array.isArray(userProfile?.technical_skills)
          ? userProfile.technical_skills.join(', ')
          : (userProfile?.technical_skills || '');
        const soft = Array.isArray(userProfile?.soft_skills)
          ? userProfile.soft_skills.join(', ')
          : (userProfile?.soft_skills || '');
        const interests = Array.isArray(userProfile?.interests)
          ? userProfile.interests.join(', ')
          : (userProfile?.interests || '');
        const summary = [skills, soft, interests, userProfile?.additional_info]
          .filter(Boolean)
          .join(', ');
        if (!summary) return;
        const res = await apiService.getJobRecommendations({ text: summary, topN: 5 });
        if (res?.success) {
          updateJobMatches(res.matches || []);
        }
      } catch (_) {
        // silent; UI will show CTA to use Job Matcher page
      }
    };
    fetchMatches();
  }, [userProfile]);

  // Removed hardcoded Action Plan and Skill Gaps; will be added when dynamic data is available

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-primary-100 text-lg">
          Here's your personalized career dashboard with AI-powered insights and recommendations.
        </p>
        {!aiAdvice && (
          <div className="mt-4 p-4 bg-primary-500 rounded-lg">
            <p className="text-primary-100">
              Complete your profile setup to get personalized AI-powered career advice!
            </p>
            <button
              onClick={() => navigate('/profile-setup')}
              className="mt-2 px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Get Started
            </button>
          </div>
        )}
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Career Matches', value: '12', icon: Target, color: 'text-blue-600' },
          { label: 'Skills to Develop', value: '8', icon: TrendingUp, color: 'text-green-600' },
          { label: 'Action Items', value: '5', icon: Calendar, color: 'text-orange-600' },
          { label: 'AI Insights', value: '24', icon: Brain, color: 'text-purple-600' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card text-center"
          >
            <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-secondary-800 mb-1">{stat.value}</div>
            <div className="text-sm text-secondary-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* AI-Generated Career Advice */}
      {aiAdvice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CareerAdviceDisplay 
            advice={aiAdvice}
            title="Your AI-Generated Career Advice"
            subtitle="Powered by AI - Personalized recommendations based on your profile"
          />
        </motion.div>
      )}

      {/* Career Recommendations (Live from Job Matcher) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary-800">Top Career Recommendations</h2>
          <button
            onClick={() => navigate('/job-matcher')}
            className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            <span>Improve Matches</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {!jobMatches || jobMatches.length === 0 ? (
          <div className="text-secondary-600">
            No matches yet. Provide skills in your profile or use the Job Matcher to generate recommendations.
            <button
              onClick={() => navigate('/job-matcher')}
              className="ml-2 underline text-primary-700"
            >
              Open Job Matcher
            </button>
          </div>
        ) : (
        <div className="space-y-4">
          {jobMatches.map((job, index) => (
            <motion.div
              key={`${job.job_title}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-800">{job.job_title}</h3>
                  <p className="text-secondary-600">{[job.city, job.state].filter(Boolean).join(', ') || '—'}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">{(job.match_score * 100).toFixed(0)}% Match</div>
                  <div className="text-sm text-secondary-600">{job.salary || '—'}</div>
                </div>
              </div>
              <p className="text-secondary-600 mb-1">Matched from your skills and interests.</p>
            </motion.div>
          ))}
        </div>
        )}
      </motion.div>

      {/* Action Plan and Skill Gap Analysis removed (no hardcoded data). Will be reintroduced with AI-generated or computed data. */}
    </div>
  );

  const renderCareerExplorer = () => (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-secondary-800 mb-4">Career Explorer</h1>
        <p className="text-lg text-secondary-600">
          Explore detailed career paths and opportunities tailored for you
        </p>
      </motion.div>

      <div className="grid gap-6">
        {(jobMatches || []).length === 0 && (
          <div className="card text-secondary-600">
            No matches yet. Go to Job Matcher to generate recommendations.
          </div>
        )}
        {(jobMatches || []).map((job, index) => (
          <motion.div
            key={`${job.job_title}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{job.job_title}</h2>
                  <div className="flex items-center text-blue-100 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{[job.city, job.state].filter(Boolean).join(', ') || 'Remote'}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-200 font-semibold text-sm">
                        {(job.match_score * 100).toFixed(0)}% Match
                      </span>
                    </div>
                    <span className="text-blue-100 text-sm">{job.salary || 'Salary not specified'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(((job.match_score || 0) * 100) / 20) ? 'text-yellow-300 fill-current' : 'text-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-xl hover:bg-white/30 transition-all duration-300 font-medium border border-white/20">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="p-6">
              <JobDetailsCard jobTitle={job.job_title} matchScore={job.match_score} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSkillGapAnalysis = () => (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-secondary-800 mb-4">Skill Gap Analysis</h1>
        <p className="text-lg text-secondary-600">
          Discover the gap between your current skills and your career goals
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SkillGapAnalysis />
      </motion.div>
    </div>
  );

  const renderAIToolkit = () => (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-secondary-800 mb-4">AI Toolkit</h1>
        <p className="text-lg text-secondary-600">
          Access powerful AI-powered tools to accelerate your career growth
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: 'Resume Reviewer',
            description: 'Get AI-powered feedback on your resume with specific improvement suggestions',
            icon: FileText,
            color: 'bg-blue-100 text-blue-600',
            action: () => navigate('/resume-reviewer')
          },
          {
            title: 'Interview Question Generator',
            description: 'Practice with personalized interview questions based on your target role',
            icon: MessageCircle,
            color: 'bg-green-100 text-green-600'
          },
          {
            title: 'Cover Letter Assistant',
            description: 'Create compelling cover letters tailored to specific job applications',
            icon: BookOpen,
            color: 'bg-purple-100 text-purple-600'
          },
          {
            title: 'Skill Assessment',
            description: 'Take comprehensive skill assessments to identify strengths and gaps',
            icon: Award,
            color: 'bg-orange-100 text-orange-600'
          },
          {
            title: 'Career Chat',
            description: 'Chat with our AI career counselor for personalized advice and guidance',
            icon: Brain,
            color: 'bg-pink-100 text-pink-600',
            action: () => navigate('/career-chat')
          },
          {
            title: 'Networking Assistant',
            description: 'Get tips and templates for professional networking and LinkedIn optimization',
            icon: Users,
            color: 'bg-indigo-100 text-indigo-600'
          }
        ].map((tool, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="card cursor-pointer hover:shadow-lg transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-4`}>
              <tool.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">{tool.title}</h3>
            <p className="text-secondary-600 text-sm mb-4">{tool.description}</p>
            <button 
              onClick={tool.action || (() => {})}
              className="btn-primary w-full"
            >
              Get Started
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'career-explorer':
        return renderCareerExplorer();
      case 'ai-toolkit':
        return renderAIToolkit();
      case 'skill-gap-analysis':
        return renderSkillGapAnalysis();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-sm shadow-sm px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">CareerAI</h1>
        <div className="w-8" />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-sm shadow-2xl z-50 lg:hidden border-r border-gray-200"
              >
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-secondary-800">CareerAI</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <nav className="p-4">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-2 transition-colors ${
                        activeSection === item.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-secondary-600 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-white/80 backdrop-blur-sm shadow-xl min-h-screen border-r border-gray-200">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-secondary-800">CareerAI</h2>
          </div>
          <nav className="p-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-2 transition-colors ${
                  activeSection === item.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-secondary-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

