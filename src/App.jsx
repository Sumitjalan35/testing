import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CareerProvider } from './contexts/CareerContext';
import LandingPage from './pages/LandingPage';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import CareerExplorer from './pages/CareerExplorer';
import AIToolkit from './pages/AIToolkit';
import SummaryPage from './pages/SummaryPage';
import JobMatcher from './pages/JobMatcher';
import CareerChat from './pages/CareerChat';
import ResumeReviewer from './pages/ResumeReviewer';

function App() {
  return (
    <CareerProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/career-explorer" element={<CareerExplorer />} />
            <Route path="/ai-toolkit" element={<AIToolkit />} />
            <Route path="/job-matcher" element={<JobMatcher />} />
            <Route path="/career-chat" element={<CareerChat />} />
            <Route path="/resume-reviewer" element={<ResumeReviewer />} />
          </Routes>
        </div>
      </Router>
    </CareerProvider>
  );
}

export default App;