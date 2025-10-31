import { createContext, useContext, useState } from 'react';

const CareerContext = createContext();

export const useCareer = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
};

export const CareerProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [userType, setUserType] = useState(null);
  const [jobMatches, setJobMatches] = useState([]);

  const updateProfile = (profile, type) => {
    setUserProfile(profile);
    setUserType(type);
  };

  const updateAIAdvice = (advice) => {
    setAiAdvice(advice);
  };

  const updateJobMatches = (matches) => {
    setJobMatches(matches || []);
  };

  const clearData = () => {
    setUserProfile(null);
    setAiAdvice(null);
    setUserType(null);
  };

  return (
    <CareerContext.Provider
      value={{
        userProfile,
        aiAdvice,
        userType,
        jobMatches,
        updateProfile,
        updateAIAdvice,
        updateJobMatches,
        clearData,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
};
