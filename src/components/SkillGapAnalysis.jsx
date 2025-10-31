import React, { useState } from 'react';
import './SkillGapAnalysis.css';

const SkillGapAnalysis = () => {
  const [currentSkills, setCurrentSkills] = useState('');
  const [targetSkills, setTargetSkills] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);

  const handleAnalyze = async () => {
    if (!currentSkills.trim() || !targetSkills.trim()) {
      setError('Please fill in both fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/analyze-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_skills: currentSkills,
          target_skills: targetSkills,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze skills');
      }

      const result = await response.json();
      setAnalysisResult(result);
      setShowChat(true);
    } catch (err) {
      setError(err.message || 'Failed to analyze skills. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentSkills('');
    setTargetSkills('');
    setAnalysisResult(null);
    setError('');
    setShowChat(false);
  };

  return (
    <div className="skill-gap-analysis">
      <div className="container">
        <h1 className="title">Skill Gap Analysis</h1>
        <p className="subtitle">
          Discover the gap between your current skills and your career goals
        </p>

        {!analysisResult ? (
          <div className="input-section">
            <div className="input-group">
              <label htmlFor="current-skills" className="label">
                Current Skills & Experience
              </label>
              <textarea
                id="current-skills"
                className="textarea"
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
                placeholder="Describe your current skills, experience, certifications, and expertise. For example: 'I have 3 years of experience in JavaScript, React, and Node.js. I've worked on 5+ web applications and have basic knowledge of Python and SQL.'"
                rows={6}
              />
            </div>

            <div className="input-group">
              <label htmlFor="target-skills" className="label">
                Target Role / Skills
              </label>
              <textarea
                id="target-skills"
                className="textarea"
                value={targetSkills}
                onChange={(e) => setTargetSkills(e.target.value)}
                placeholder="Describe your target role or the skills you want to achieve. You can paste a job description or describe your goals. For example: 'Senior Full Stack Developer position requiring advanced React, Node.js, AWS, Docker, and microservices architecture.'"
                rows={6}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="button-group">
              <button
                className="analyze-button"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  'Analyze Skills Gap'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="results-section">
            <div className="results-header">
              <h2>Your Skill Gap Analysis</h2>
              <button className="reset-button" onClick={handleReset}>
                New Analysis
              </button>
            </div>

            <div className="results-content">
              <div className="summary-card">
                <h3>Summary</h3>
                <p>{analysisResult.summary}</p>
                <div className="confidence-score">
                  <span>Confidence Score: </span>
                  <span className="score">{Math.round(analysisResult.confidence_score * 100)}%</span>
                </div>
              </div>

              <div className="skills-grid">
                <div className="skill-card existing-skills">
                  <h3>✅ Your Existing Skills</h3>
                  <ul>
                    {analysisResult.existing_skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>

                <div className="skill-card missing-skills">
                  <h3>🎯 Skills to Develop</h3>
                  <ul>
                    {analysisResult.missing_skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="learning-path-card">
                <h3>📚 Recommended Learning Path</h3>
                <ol>
                  {analysisResult.learning_path.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
                <div className="timeline">
                  <strong>Estimated Timeline: </strong>
                  {analysisResult.timeline}
                </div>
              </div>
            </div>

            {showChat && (
              <div className="chat-section">
                <ChatInterface analysisContext={analysisResult} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Chat Interface Component
const ChatInterface = ({ analysisContext }) => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      message: "Hi! I've analyzed your skills. Feel free to ask me any questions about your skill gap analysis, learning recommendations, or career advice!",
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const newUserMessage = { type: 'user', message: currentMessage };
    setMessages(prev => [...prev, newUserMessage]);
    setCurrentMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/skill-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          context: analysisContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get chat response');
      }

      const result = await response.json();
      const botMessage = { type: 'bot', message: result.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = { 
        type: 'bot', 
        message: 'Sorry, I encountered an error. Please try asking your question again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <h3>💬 Ask Questions About Your Analysis</h3>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <div className="message-content">
              {msg.message}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <div className="message-content">
              <span className="typing-indicator">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <textarea
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about your skills, learning path, career advice, or any specific questions..."
          rows={3}
        />
        <button onClick={sendMessage} disabled={loading || !currentMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
