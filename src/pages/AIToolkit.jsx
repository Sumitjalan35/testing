import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, FileText, MessageCircle, BookOpen, Award, Users, 
  Send, X, Download, Upload, Star, CheckCircle, Clock,
  Lightbulb, Target, TrendingUp, Zap
} from 'lucide-react';

const AIToolkit = () => {
  const [activeTool, setActiveTool] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      message: 'Hello! I\'m your AI career counselor. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const tools = [
    {
      id: 'resume-reviewer',
      title: 'Resume Reviewer',
      description: 'Get AI-powered feedback on your resume with specific improvement suggestions',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
      features: ['Grammar & formatting check', 'ATS optimization', 'Content suggestions', 'Skills gap analysis']
    },
    {
      id: 'interview-prep',
      title: 'Interview Question Generator',
      description: 'Practice with personalized interview questions based on your target role',
      icon: MessageCircle,
      color: 'bg-green-100 text-green-600',
      features: ['Role-specific questions', 'Behavioral questions', 'Technical questions', 'Mock interviews']
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter Assistant',
      description: 'Create compelling cover letters tailored to specific job applications',
      icon: BookOpen,
      color: 'bg-purple-100 text-purple-600',
      features: ['Job-specific templates', 'Company research', 'Personalization tips', 'A/B testing']
    },
    {
      id: 'skill-assessment',
      title: 'Skill Assessment',
      description: 'Take comprehensive skill assessments to identify strengths and gaps',
      icon: Award,
      color: 'bg-orange-100 text-orange-600',
      features: ['Technical skills test', 'Soft skills evaluation', 'Industry benchmarks', 'Learning paths']
    },
    {
      id: 'career-chat',
      title: 'Career Chat',
      description: 'Chat with our AI career counselor for personalized advice and guidance',
      icon: Brain,
      color: 'bg-pink-100 text-pink-600',
      features: ['24/7 availability', 'Personalized advice', 'Career planning', 'Goal setting']
    },
    {
      id: 'networking',
      title: 'Networking Assistant',
      description: 'Get tips and templates for professional networking and LinkedIn optimization',
      icon: Users,
      color: 'bg-indigo-100 text-indigo-600',
      features: ['LinkedIn optimization', 'Networking templates', 'Event recommendations', 'Connection strategies']
    }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: chatMessages.length + 2,
        type: 'ai',
        message: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (userMessage) => {
    const responses = [
      "That's a great question! Based on your profile, I'd recommend focusing on building your technical skills first. What specific area interests you most?",
      "I understand your concern. Many professionals face similar challenges. Let me suggest a structured approach to address this.",
      "Excellent point! Have you considered taking online courses or certifications in that area? I can recommend some specific programs.",
      "Based on your background, I think you're on the right track. Here are some actionable steps you can take this week...",
      "That's a common career transition. Let me break down the key skills you'll need to develop and how to acquire them."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const renderResumeReviewer = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary-800 mb-2">Resume Reviewer</h2>
        <p className="text-secondary-600">Upload your resume for AI-powered analysis and feedback</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-800 mb-4">Upload Resume</h3>
          <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600 mb-2">Drag and drop your resume here</p>
            <p className="text-sm text-secondary-500">or click to browse files</p>
            <p className="text-xs text-secondary-400 mt-2">Supports PDF, DOC, DOCX (Max 5MB)</p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-800 mb-4">Analysis Results</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-secondary-600">Format: Professional</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-secondary-600">Length: Appropriate</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-secondary-600">Keywords: Needs improvement</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-secondary-600">Skills section: Could be stronger</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-800 mb-4">AI Recommendations</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Add More Action Verbs</h4>
            <p className="text-sm text-blue-700">Use strong action verbs like "achieved," "implemented," and "optimized" to make your experience more impactful.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Quantify Your Achievements</h4>
            <p className="text-sm text-green-700">Add specific numbers and metrics to demonstrate the impact of your work (e.g., "increased efficiency by 25%").</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">Optimize for ATS</h4>
            <p className="text-sm text-purple-700">Include relevant keywords from job descriptions to improve your chances of passing Applicant Tracking Systems.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInterviewPrep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary-800 mb-2">Interview Question Generator</h2>
        <p className="text-secondary-600">Practice with personalized questions for your target role</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-800 mb-4">Question Categories</h3>
          <div className="space-y-3">
            {[
              { category: 'Technical Questions', count: 15, difficulty: 'Medium' },
              { category: 'Behavioral Questions', count: 12, difficulty: 'Easy' },
              { category: 'Situational Questions', count: 8, difficulty: 'Hard' },
              { category: 'Company-specific', count: 5, difficulty: 'Medium' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-800">{item.category}</p>
                  <p className="text-sm text-secondary-600">{item.count} questions</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  item.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  item.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {item.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-800 mb-4">Sample Questions</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Technical Question</h4>
              <p className="text-sm text-blue-700">"Explain how you would optimize a slow-running database query. Walk me through your thought process."</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Behavioral Question</h4>
              <p className="text-sm text-green-700">"Tell me about a time when you had to work with a difficult team member. How did you handle it?"</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Situational Question</h4>
              <p className="text-sm text-purple-700">"How would you prioritize features for a new product launch with limited resources?"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-800 mb-4">Mock Interview</h3>
        <div className="text-center">
          <button className="btn-primary px-8 py-3">Start Mock Interview</button>
          <p className="text-sm text-secondary-600 mt-2">Practice with AI-powered mock interviews</p>
        </div>
      </div>
    </div>
  );

  const renderCareerChat = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary-800 mb-2">AI Career Counselor</h2>
        <p className="text-secondary-600">Chat with our AI for personalized career advice</p>
      </div>

      <div className="card h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-secondary-800'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your career..."
              className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleSendMessage}
              className="btn-primary px-4 py-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderToolContent = () => {
    switch (activeTool) {
      case 'resume-reviewer':
        return renderResumeReviewer();
      case 'interview-prep':
        return renderInterviewPrep();
      case 'career-chat':
        return renderCareerChat();
      default:
        return (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-800 mb-2">Select a Tool</h3>
            <p className="text-secondary-600">Choose an AI tool from the sidebar to get started</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-secondary-800 mb-4">AI Toolkit</h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Access powerful AI-powered tools to accelerate your career growth. 
            Get personalized insights, practice interviews, and optimize your professional materials.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tools Sidebar */}
          <div className="lg:w-80">
            <div className="card">
              <h2 className="text-lg font-semibold text-secondary-800 mb-4">Available Tools</h2>
              <div className="space-y-2">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeTool === tool.id
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'hover:bg-gray-50 text-secondary-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg ${tool.color} flex items-center justify-center`}>
                        <tool.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tool.title}</p>
                        <p className="text-xs text-secondary-500">{tool.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tool Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderToolContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIToolkit;
