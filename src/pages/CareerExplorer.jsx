import { motion } from 'framer-motion';
import { useState } from 'react';
import { Star, MapPin, Clock, TrendingUp, Users, DollarSign, BookOpen, ChevronRight } from 'lucide-react';

const CareerExplorer = () => {
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [filter, setFilter] = useState('all');

  const careerData = [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Tech Companies',
      match: 95,
      salary: '₹8-15 LPA',
      experience: '0-3 years',
      location: 'Bangalore, Mumbai, Pune',
      description: 'Perfect match based on your technical skills and interests in coding and problem solving.',
      skills: ['Python', 'JavaScript', 'React', 'Node.js', 'Problem Solving'],
      growth: '+15% job growth',
      dayInLife: [
        'Morning standup meetings with the team',
        'Code development and feature implementation',
        'Code reviews and collaboration',
        'Testing and debugging applications',
        'Planning and architecture discussions'
      ],
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        'Proficiency in programming languages (Python, JavaScript)',
        'Experience with web development frameworks',
        'Strong problem-solving and analytical skills',
        'Good communication and teamwork abilities'
      ],
      futureOutlook: 'Excellent growth prospects with increasing demand for software engineers across all industries. Remote work opportunities are expanding.',
      responsibilities: [
        'Design and develop software applications',
        'Collaborate with cross-functional teams',
        'Write clean, maintainable code',
        'Debug and fix software issues',
        'Participate in code reviews',
        'Stay updated with latest technologies'
      ]
    },
    {
      id: 2,
      title: 'Data Scientist',
      company: 'AI/ML Companies',
      match: 88,
      salary: '₹10-18 LPA',
      experience: '1-4 years',
      location: 'Bangalore, Hyderabad, Delhi',
      description: 'Strong match for your analytical skills and interest in AI and machine learning technologies.',
      skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'Statistics'],
      growth: '+25% job growth',
      dayInLife: [
        'Data collection and preprocessing',
        'Statistical analysis and modeling',
        'Machine learning model development',
        'Data visualization and reporting',
        'Collaboration with business stakeholders'
      ],
      requirements: [
        'Master\'s degree in Data Science, Statistics, or related field',
        'Strong programming skills in Python/R',
        'Experience with machine learning libraries',
        'Knowledge of statistics and mathematics',
        'Experience with data visualization tools'
      ],
      futureOutlook: 'Rapidly growing field with high demand across industries. AI and ML expertise is highly valued.',
      responsibilities: [
        'Analyze large datasets to extract insights',
        'Build and deploy machine learning models',
        'Create data visualizations and reports',
        'Collaborate with business teams',
        'Stay updated with latest ML techniques',
        'Present findings to stakeholders'
      ]
    },
    {
      id: 3,
      title: 'Product Manager',
      company: 'Startups & Tech',
      match: 82,
      salary: '₹12-20 LPA',
      experience: '2-5 years',
      location: 'Mumbai, Bangalore, Delhi',
      description: 'Good match for your leadership and communication skills with technical background.',
      skills: ['Leadership', 'Communication', 'Product Strategy', 'Analytics', 'User Research'],
      growth: '+20% job growth',
      dayInLife: [
        'Morning team standup and planning',
        'User research and market analysis',
        'Product roadmap planning',
        'Cross-functional team coordination',
        'Stakeholder meetings and presentations'
      ],
      requirements: [
        'Bachelor\'s degree in Business, Engineering, or related field',
        '2+ years of product management experience',
        'Strong analytical and problem-solving skills',
        'Excellent communication and leadership abilities',
        'Experience with product analytics tools'
      ],
      futureOutlook: 'High demand for product managers with technical backgrounds. Great career progression opportunities.',
      responsibilities: [
        'Define product strategy and roadmap',
        'Collaborate with engineering and design teams',
        'Conduct user research and market analysis',
        'Manage product lifecycle from conception to launch',
        'Track product metrics and KPIs',
        'Communicate with stakeholders and executives'
      ]
    },
    {
      id: 4,
      title: 'UX/UI Designer',
      company: 'Design Agencies & Tech',
      match: 75,
      salary: '₹6-12 LPA',
      experience: '1-3 years',
      location: 'Mumbai, Bangalore, Delhi',
      description: 'Good match for your creative interests and problem-solving skills.',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Thinking', 'Creativity'],
      growth: '+18% job growth',
      dayInLife: [
        'User research and interviews',
        'Wireframing and prototyping',
        'Design system development',
        'Collaboration with developers',
        'User testing and feedback analysis'
      ],
      requirements: [
        'Bachelor\'s degree in Design or related field',
        'Portfolio showcasing UX/UI design work',
        'Proficiency in design tools (Figma, Sketch)',
        'Understanding of user-centered design principles',
        'Strong visual design and communication skills'
      ],
      futureOutlook: 'Growing demand for UX/UI designers as companies focus on user experience. Remote work opportunities available.',
      responsibilities: [
        'Conduct user research and usability testing',
        'Create wireframes, prototypes, and mockups',
        'Design user interfaces and experiences',
        'Collaborate with product and engineering teams',
        'Maintain design systems and guidelines',
        'Present design concepts to stakeholders'
      ]
    }
  ];

  const filteredCareers = filter === 'all' 
    ? careerData 
    : careerData.filter(career => 
        filter === 'high-match' ? career.match >= 85 :
        filter === 'tech' ? career.title.includes('Engineer') || career.title.includes('Data') :
        career.title.includes('Manager') || career.title.includes('Designer')
      );

  const renderCareerCard = (career) => (
    <motion.div
      key={career.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={() => setSelectedCareer(career)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-secondary-800 mb-1">{career.title}</h3>
          <p className="text-secondary-600">{career.company}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(career.match / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm font-medium text-green-600">{career.match}% Match</span>
          </div>
          <div className="text-sm text-secondary-600">{career.salary}</div>
        </div>
      </div>
      
      <p className="text-secondary-600 mb-4">{career.description}</p>
      
      <div className="flex items-center space-x-4 text-sm text-secondary-500 mb-4">
        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4" />
          <span>{career.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{career.experience}</span>
        </div>
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-4 h-4" />
          <span>{career.growth}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {career.skills.slice(0, 4).map((skill, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs"
          >
            {skill}
          </span>
        ))}
        {career.skills.length > 4 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
            +{career.skills.length - 4} more
          </span>
        )}
      </div>
    </motion.div>
  );

  const renderCareerDetail = () => {
    if (!selectedCareer) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedCareer(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold text-secondary-800 mb-2">{selectedCareer.title}</h2>
                <p className="text-lg text-secondary-600">{selectedCareer.company}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium text-green-600">{selectedCareer.match}% Match</span>
                  </div>
                  <span className="text-secondary-600">{selectedCareer.salary}</span>
                  <span className="text-green-600">{selectedCareer.growth}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCareer(null)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <ChevronRight className="w-6 h-6 rotate-45" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">Role Description</h3>
              <p className="text-secondary-600">{selectedCareer.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-3">Day in the Life</h3>
                <ul className="space-y-2">
                  {selectedCareer.dayInLife.map((activity, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-secondary-600">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-3">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {selectedCareer.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-secondary-600">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCareer.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">Requirements</h3>
              <ul className="space-y-2">
                {selectedCareer.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-secondary-600">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">Future Outlook</h3>
              <p className="text-secondary-600">{selectedCareer.futureOutlook}</p>
            </div>

            <div className="flex space-x-4 pt-4">
              <button className="btn-primary flex-1">Apply Now</button>
              <button className="btn-secondary flex-1">Save for Later</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-secondary-800 mb-4">Career Explorer</h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Discover detailed career paths and opportunities tailored to your profile. 
            Explore roles, requirements, and growth prospects.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 mb-8 justify-center"
        >
          {[
            { id: 'all', label: 'All Careers' },
            { id: 'high-match', label: 'High Match (85%+)' },
            { id: 'tech', label: 'Technology' },
            { id: 'management', label: 'Management' }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === filterOption.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-secondary-600 hover:bg-primary-50 border border-secondary-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </motion.div>

        {/* Career Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCareers.map((career, index) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {renderCareerCard(career)}
            </motion.div>
          ))}
        </motion.div>

        {/* Career Detail Modal */}
        <AnimatePresence>
          {selectedCareer && renderCareerDetail()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CareerExplorer;
