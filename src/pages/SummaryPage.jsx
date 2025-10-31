import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, User, GraduationCap, Briefcase, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCareer } from '../contexts/CareerContext';
import CareerAdviceDisplay from '../components/CareerAdviceDisplay';
import apiService from '../services/api';

const SummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, userType } = location.state || {};
  const { updateProfile, updateAIAdvice } = useCareer();
  
  const [aiAdvice, setAiAdvice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!formData) {
    navigate('/profile-setup');
    return null;
  }

  // Fetch AI advice when component mounts
  useEffect(() => {
    const fetchAIAdvice = async () => {
      setIsLoading(true);
      setError(null);
      
      console.log('Starting AI advice fetch...', { userType, formData });
      
      try {
        let response;
        if (userType === 'student') {
          console.log('Calling student API...');
          response = await apiService.getStudentCareerAdvice(formData);
        } else {
          console.log('Calling professional API...');
          response = await apiService.getProfessionalCareerAdvice(formData);
        }
        
        console.log('API Response:', response);
        
        if (response && response.success) {
          console.log('Setting AI advice:', response.advice);
          setAiAdvice(response.advice);
          updateAIAdvice(response.advice);
          updateProfile(formData, userType);
        } else {
          console.error('API returned error:', response);
          setError(response?.error || 'Failed to generate advice');
        }
      } catch (err) {
        console.error('Error fetching AI advice:', err);
        setError(`Failed to connect to AI service: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAIAdvice();
  }, [formData, userType]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
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

  const renderStudentSummary = () => (
    <div className="space-y-8">
      <motion.div
        variants={itemVariants}
        className="text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-secondary-800 mb-2">
          Student Profile Summary
        </h2>
        <p className="text-lg text-secondary-600">
          Here's what we've learned about your academic profile
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="card">
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Academic Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Class Level:</span>
              <span className="font-medium">{formData.class_level || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Academic Performance:</span>
              <span className="font-medium">{formData.academic_performance || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Stream:</span>
              <span className="font-medium capitalize">{formData.stream || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Budget:</span>
              <span className="font-medium">{formData.budget || 'Not specified'}</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card">
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Career Preferences</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Location:</span>
              <span className="font-medium">{formData.location_preference || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Career Type:</span>
              <span className="font-medium capitalize">{formData.career_type_preference || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Competitive Exams:</span>
              <span className="font-medium">{formData.competitive_exam_interest ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card">
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {formData.interests?.length > 0 ? (
              formData.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))
            ) : (
              <span className="text-secondary-500">No interests specified</span>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card">
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Technical Skills</h3>
          <div className="flex flex-wrap gap-2">
            {formData.technical_skills?.length > 0 ? (
              formData.technical_skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-secondary-500">No technical skills specified</span>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card">
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Soft Skills</h3>
          <div className="flex flex-wrap gap-2">
            {formData.soft_skills?.length > 0 ? (
              formData.soft_skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-secondary-500">No soft skills specified</span>
            )}
          </div>
        </motion.div>

        {formData.additional_info && (
          <motion.div variants={itemVariants} className="card md:col-span-2">
            <h3 className="text-xl font-semibold text-secondary-800 mb-4">Additional Information</h3>
            <p className="text-secondary-600">{formData.additional_info}</p>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderProfessionalSummary = () => (
    <div className="space-y-8">
      <motion.div
        variants={itemVariants}
        className="text-center"
      >
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-secondary-800 mb-2">
          Professional Profile Summary
        </h2>
        <p className="text-lg text-secondary-600">
          Here's what we've learned about your professional profile
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="card">
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Current Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Status:</span>
              <span className="font-medium capitalize">{formData.current_status || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Experience:</span>
              <span className="font-medium">{formData.experience_gaps || 'Not specified'}</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card">
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Career Goals</h3>
          <p className="text-secondary-600">
            {formData.career_goals || 'No career goals specified'}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="card">
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Skills Assessment</h3>
          <div className="space-y-2">
            {Object.keys(formData.skill_assessment || {}).length > 0 ? (
              Object.entries(formData.skill_assessment).map(([skill, level]) => (
                <div key={skill} className="flex justify-between">
                  <span className="text-secondary-600">{skill}:</span>
                  <span className="font-medium">{level}</span>
                </div>
              ))
            ) : (
              <span className="text-secondary-500">No skills assessed</span>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card">
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Work Preferences</h3>
          <p className="text-secondary-600">
            {formData.work_preferences || 'No work preferences specified'}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="card">
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Learning Goals</h3>
          <p className="text-secondary-600">
            {formData.learning_development || 'No learning goals specified'}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="card">
          <h3 className="text-xl font-semibold text-secondary-800 mb-4">Current Challenges</h3>
          <div className="flex flex-wrap gap-2">
            {formData.current_challenges?.length > 0 ? (
              formData.current_challenges.map((challenge, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                >
                  {challenge}
                </span>
              ))
            ) : (
              <span className="text-secondary-500">No challenges specified</span>
            )}
          </div>
        </motion.div>

        {formData.target_applications && (
          <motion.div variants={itemVariants} className="card md:col-span-2">
            <h3 className="text-xl font-semibold text-secondary-800 mb-4">Target Applications</h3>
            <p className="text-secondary-600">{formData.target_applications}</p>
          </motion.div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-secondary-800 mb-4">
              Profile Setup Complete!
            </h1>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Thank you for providing your information. Our AI will now analyze your profile 
              and generate personalized career recommendations.
            </p>
          </motion.div>

          {/* Summary Content */}
          <motion.div variants={itemVariants} className="card">
            {userType === 'student' ? renderStudentSummary() : renderProfessionalSummary()}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile-setup')}
              className="btn-secondary flex items-center space-x-2 px-6 py-3"
            >
              <span>Edit Profile</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="btn-primary flex items-center space-x-2 px-6 py-3"
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* AI Advice Section */}
          {isLoading && (
            <motion.div
              variants={itemVariants}
              className="bg-primary-50 border border-primary-200 rounded-lg p-6 text-center"
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
                <span className="text-primary-600 font-medium">AI Analysis in Progress</span>
              </div>
              <p className="text-primary-600">
                Our AI is analyzing your profile and generating personalized career recommendations. 
                This usually takes a few moments.
              </p>
            </motion.div>
          )}

          {error && (
            <motion.div
              variants={itemVariants}
              className="bg-red-50 border border-red-200 rounded-lg p-6"
            >
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-800">Error Generating Advice</h3>
              </div>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => {
                    setError(null);
                    setIsLoading(true);
                    // Retry the API call
                    const fetchAIAdvice = async () => {
                      try {
                        let response;
                        if (userType === 'student') {
                          response = await apiService.getStudentCareerAdvice(formData);
                        } else {
                          response = await apiService.getProfessionalCareerAdvice(formData);
                        }
                        
                        if (response && response.success) {
                          setAiAdvice(response.advice);
                        } else {
                          setError(response?.error || 'Failed to generate advice');
                        }
                      } catch (err) {
                        setError(`Failed to connect to AI service: ${err.message}`);
                      } finally {
                        setIsLoading(false);
                      }
                    };
                    fetchAIAdvice();
                  }}
                  className="btn-secondary"
                >
                  Retry API Call
                </button>
              </div>
            </motion.div>
          )}

          {aiAdvice && (
            <motion.div variants={itemVariants}>
              <CareerAdviceDisplay 
                advice={aiAdvice}
                title="Your Personalized Career Advice"
                subtitle="Based on your profile, here are our AI-powered recommendations"
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SummaryPage;
