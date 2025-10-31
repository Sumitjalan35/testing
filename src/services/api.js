// API service for communicating with the backend
const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic API call method
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health');
  }

  // Student career advice
  async getStudentCareerAdvice(formData) {
    return this.makeRequest('/api/student/career-advice', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Professional career advice
  async getProfessionalCareerAdvice(formData) {
    return this.makeRequest('/api/professional/career-advice', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Job recommendations from TF-IDF artifacts
  async getJobRecommendations({ text, topN = 5 }) {
    return this.makeRequest('/api/jobs/recommend', {
      method: 'POST',
      body: JSON.stringify({ text, top_n: topN }),
    });
  }

  // Get sample requests for testing
  async getStudentSampleRequest() {
    return this.makeRequest('/api/student/career-advice/sample');
  }

  async getProfessionalSampleRequest() {
    return this.makeRequest('/api/professional/career-advice/sample');
  }

  // Resume review (multipart upload). If file is null, backend will use sample.pdf fallback
  async reviewCV(file) {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    const url = `${this.baseURL}/api/review-cv`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Interview: start session
  async startInterview({ role, num_questions, difficulty }) {
    return this.makeRequest('/api/interview/start', {
      method: 'POST',
      body: JSON.stringify({ role, num_questions, difficulty }),
    });
  }

  // Interview: chat
  async interviewChat({ session_id, message }) {
    return this.makeRequest('/api/interview/chat', {
      method: 'POST',
      body: JSON.stringify({ session_id, message }),
    });
  }

  // Interview: history
  async getInterviewHistory(sessionId) {
    return this.makeRequest(`/api/interview/history/${sessionId}`);
  }

  // Interview: delete session
  async deleteInterviewSession(sessionId) {
    return this.makeRequest(`/api/interview/session/${sessionId}`, { method: 'DELETE' });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
