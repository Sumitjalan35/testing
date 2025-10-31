import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, User, Briefcase } from 'lucide-react';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    // Student fields
    class_level: '',
    academic_performance: '',
    stream: '',
    interests: [],
    budget: '',
    location_preference: '',
    competitive_exam_interest: false,
    career_type_preference: '',
    technical_skills: [],
    soft_skills: [],
    additional_info: '',
    // Professional fields
    current_status: '',
    career_goals: '',
    skill_assessment: {},
    experience_gaps: '',
    work_preferences: '',
    learning_development: '',
    current_challenges: [],
    target_applications: []
  });

  const studentSteps = [
    { id: 'user-type', title: 'User Type' },
    { id: 'academic', title: 'Academic Info' },
    { id: 'interests', title: 'Interests & Skills' },
    { id: 'preferences', title: 'Preferences' },
    { id: 'additional', title: 'Additional Info' }
  ];

  const professionalSteps = [
    { id: 'user-type', title: 'User Type' },
    { id: 'current-status', title: 'Current Status' },
    { id: 'goals', title: 'Career Goals' },
    { id: 'skills', title: 'Skills Assessment' },
    { id: 'preferences', title: 'Work Preferences' },
    { id: 'challenges', title: 'Challenges & Development' }
  ];

  const steps = userType === 'student' ? studentSteps : professionalSteps;
  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      console.log('Form Data:', formData);
      navigate('/summary', { state: { formData, userType } });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const renderUserTypeStep = () => (
    <motion.div
      key="user-type"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-secondary-800 mb-4">
          Let's Get Started!
        </h2>
        <p className="text-lg text-secondary-600">
          Tell us about yourself to get personalized career recommendations
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`card cursor-pointer transition-all duration-300 ${
            userType === 'student' ? 'ring-2 ring-primary-500 bg-primary-50' : 'hover:shadow-lg'
          }`}
          onClick={() => setUserType('student')}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-800 mb-2">
              Student
            </h3>
            <p className="text-secondary-600">
              I'm a student looking for career guidance and educational path recommendations
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`card cursor-pointer transition-all duration-300 ${
            userType === 'professional' ? 'ring-2 ring-primary-500 bg-primary-50' : 'hover:shadow-lg'
          }`}
          onClick={() => setUserType('professional')}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-800 mb-2">
              Working Professional
            </h3>
            <p className="text-secondary-600">
              I'm already working and looking to advance or change my career path
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderStudentAcademicStep = () => (
    <motion.div
      key="academic"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-800 mb-4">
          Academic Information
        </h2>
        <p className="text-lg text-secondary-600">
          Help us understand your educational background
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Current Class Level
          </label>
          <select
            value={formData.class_level}
            onChange={(e) => handleInputChange('class_level', e.target.value)}
            className="input-field"
          >
            <option value="">Select your class level</option>
            <option value="10th Grade">10th Grade</option>
            <option value="12th Grade">12th Grade</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Academic Performance (%)
          </label>
          <input
            type="number"
            value={formData.academic_performance}
            onChange={(e) => handleInputChange('academic_performance', e.target.value)}
            placeholder="Enter your percentage"
            className="input-field"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Stream
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['Science', 'Commerce', 'Arts', 'Other'].map((stream) => (
              <button
                key={stream}
                type="button"
                onClick={() => handleInputChange('stream', stream.toLowerCase())}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  formData.stream === stream.toLowerCase()
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-secondary-200 hover:border-primary-300'
                }`}
              >
                {stream}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Budget for Education (₹)
          </label>
          <select
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
            className="input-field"
          >
            <option value="">Select budget range</option>
            <option value="Under 1 lakh">Under ₹1 lakh</option>
            <option value="1-2 lakhs">₹1-2 lakhs</option>
            <option value="2-5 lakhs">₹2-5 lakhs</option>
            <option value="5-10 lakhs">₹5-10 lakhs</option>
            <option value="Above 10 lakhs">Above ₹10 lakhs</option>
          </select>
        </div>
      </div>
    </motion.div>
  );

  const renderInterestsStep = () => (
    <motion.div
      key="interests"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-800 mb-4">
          Interests & Skills
        </h2>
        <p className="text-lg text-secondary-600">
          Tell us about your interests and skills
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-4">
            What are your interests? (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Coding', 'Mathematics', 'Problem Solving', 'Design', 'Writing',
              'Music', 'Sports', 'Art', 'Science', 'Business', 'Technology', 'Research'
            ].map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleMultiSelect('interests', interest.toLowerCase())}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                  formData.interests.includes(interest.toLowerCase())
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-secondary-200 hover:border-primary-300'
                }`}
              >
                {formData.interests.includes(interest.toLowerCase()) && (
                  <Check className="w-4 h-4 mr-2" />
                )}
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-4">
            Technical Skills (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Python', 'JavaScript', 'HTML/CSS', 'Java', 'C++', 'React',
              'Node.js', 'SQL', 'Machine Learning', 'Data Analysis', 'Web Development', 'Mobile Development'
            ].map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleMultiSelect('technical_skills', skill)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                  formData.technical_skills.includes(skill)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-secondary-200 hover:border-primary-300'
                }`}
              >
                {formData.technical_skills.includes(skill) && (
                  <Check className="w-4 h-4 mr-2" />
                )}
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-4">
            Soft Skills (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Leadership', 'Team Work', 'Communication', 'Problem Solving',
              'Time Management', 'Creativity', 'Adaptability', 'Critical Thinking'
            ].map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleMultiSelect('soft_skills', skill)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                  formData.soft_skills.includes(skill)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-secondary-200 hover:border-primary-300'
                }`}
              >
                {formData.soft_skills.includes(skill) && (
                  <Check className="w-4 h-4 mr-2" />
                )}
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderPreferencesStep = () => (
    <motion.div
      key="preferences"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-800 mb-4">
          Career Preferences
        </h2>
        <p className="text-lg text-secondary-600">
          Help us understand your career preferences
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Location Preference
          </label>
          <input
            type="text"
            value={formData.location_preference}
            onChange={(e) => handleInputChange('location_preference', e.target.value)}
            placeholder="e.g., Mumbai, Bangalore, Remote"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Career Type Preference
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['Private', 'Government', 'Startup', 'Freelance'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleInputChange('career_type_preference', type.toLowerCase())}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  formData.career_type_preference === type.toLowerCase()
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-secondary-200 hover:border-primary-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-4">
            Are you interested in competitive exams?
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handleInputChange('competitive_exam_interest', true)}
              className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                formData.competitive_exam_interest === true
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-secondary-200 hover:border-primary-300'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('competitive_exam_interest', false)}
              className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                formData.competitive_exam_interest === false
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-secondary-200 hover:border-primary-300'
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderAdditionalInfoStep = () => (
    <motion.div
      key="additional"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-800 mb-4">
          Additional Information
        </h2>
        <p className="text-lg text-secondary-600">
          Any additional information you'd like to share?
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Additional Information
          </label>
          <textarea
            value={formData.additional_info}
            onChange={(e) => handleInputChange('additional_info', e.target.value)}
            placeholder="Tell us anything else that might help us provide better career guidance..."
            rows={6}
            className="input-field resize-none"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderProfessionalCurrentStatusStep = () => (
    <motion.div
      key="current-status"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-800 mb-4">
          Current Professional Status
        </h2>
        <p className="text-lg text-secondary-600">
          Tell us about your current work situation
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Current Status
          </label>
          <select
            value={formData.current_status}
            onChange={(e) => handleInputChange('current_status', e.target.value)}
            className="input-field"
          >
            <option value="">Select your current status</option>
            <option value="employed">Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="freelancing">Freelancing</option>
            <option value="entrepreneur">Entrepreneur</option>
            <option value="career-break">Career Break</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Years of Experience
          </label>
          <select
            value={formData.experience_gaps}
            onChange={(e) => handleInputChange('experience_gaps', e.target.value)}
            className="input-field"
          >
            <option value="">Select experience level</option>
            <option value="0-1 years">0-1 years</option>
            <option value="1-3 years">1-3 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5-10 years">5-10 years</option>
            <option value="10+ years">10+ years</option>
          </select>
        </div>
      </div>
    </motion.div>
  );

  const renderGoalsStep = () => (
    <motion.div
      key="goals"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-800 mb-4">
          Career Goals
        </h2>
        <p className="text-lg text-secondary-600">
          What are your career aspirations?
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Career Goals
          </label>
          <textarea
            value={formData.career_goals}
            onChange={(e) => handleInputChange('career_goals', e.target.value)}
            placeholder="Describe your short-term and long-term career goals..."
            rows={6}
            className="input-field resize-none"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderSkillsAssessmentStep = () => (
    <motion.div
      key="skills"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-800 mb-4">
          Skills Assessment
        </h2>
        <p className="text-lg text-secondary-600">
          Rate your current skill levels
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {[
          'Technical Skills', 'Communication', 'Leadership', 'Problem Solving',
          'Project Management', 'Team Collaboration', 'Time Management', 'Creativity'
        ].map((skill) => (
          <div key={skill}>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              {skill}
            </label>
            <select
              value={formData.skill_assessment[skill] || ''}
              onChange={(e) => handleInputChange('skill_assessment', {
                ...formData.skill_assessment,
                [skill]: e.target.value
              })}
              className="input-field"
            >
              <option value="">Select skill level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderWorkPreferencesStep = () => (
    <motion.div
      key="work-preferences"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-800 mb-4">
          Work Preferences
        </h2>
        <p className="text-lg text-secondary-600">
          What kind of work environment do you prefer?
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Work Preferences
          </label>
          <textarea
            value={formData.work_preferences}
            onChange={(e) => handleInputChange('work_preferences', e.target.value)}
            placeholder="Describe your ideal work environment, company culture, work-life balance preferences..."
            rows={4}
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Learning & Development Goals
          </label>
          <textarea
            value={formData.learning_development}
            onChange={(e) => handleInputChange('learning_development', e.target.value)}
            placeholder="What skills or knowledge areas do you want to develop further?"
            rows={4}
            className="input-field resize-none"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderChallengesStep = () => (
    <motion.div
      key="challenges"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-800 mb-4">
          Challenges & Development
        </h2>
        <p className="text-lg text-secondary-600">
          What challenges are you facing in your career?
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-4">
            Current Challenges (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Skill Gap', 'Career Growth', 'Work-Life Balance', 'Job Security',
              'Salary Expectations', 'Industry Change', 'Leadership Opportunities', 'Networking'
            ].map((challenge) => (
              <button
                key={challenge}
                type="button"
                onClick={() => handleMultiSelect('current_challenges', challenge)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                  formData.current_challenges.includes(challenge)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-secondary-200 hover:border-primary-300'
                }`}
              >
                {formData.current_challenges.includes(challenge) && (
                  <Check className="w-4 h-4 mr-2" />
                )}
                {challenge}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Target Applications/Industries
          </label>
          <textarea
            value={formData.target_applications}
            onChange={(e) => handleInputChange('target_applications', e.target.value)}
            placeholder="What industries or types of companies are you interested in?"
            rows={3}
            className="input-field resize-none"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    if (!userType) return renderUserTypeStep();
    
    const stepId = steps[currentStep].id;
    
    switch (stepId) {
      case 'user-type':
        return renderUserTypeStep();
      case 'academic':
        return renderStudentAcademicStep();
      case 'interests':
        return renderInterestsStep();
      case 'preferences':
        return renderPreferencesStep();
      case 'additional':
        return renderAdditionalInfoStep();
      case 'current-status':
        return renderProfessionalCurrentStatusStep();
      case 'goals':
        return renderGoalsStep();
      case 'skills':
        return renderSkillsAssessmentStep();
      case 'challenges':
        return renderChallengesStep();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-700">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm text-secondary-500">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="card min-h-[600px]">
          <AnimatePresence mode="wait">
            {renderCurrentStep()}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 0
                ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                : 'bg-white text-secondary-700 hover:bg-secondary-50 border border-secondary-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="btn-primary flex items-center space-x-2 px-6 py-3"
          >
            <span>{currentStep === totalSteps - 1 ? 'Complete' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
