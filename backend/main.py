import vertexai
import io
import os
import json
import re
from typing import List, Optional, Dict , Any
import os
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import uvicorn
import joblib
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import google.generativeai as genai
from langchain_google_vertexai import ChatVertexAI
from vertexai.generative_models import GenerativeModel
import PyPDF2

vertexai.init(project="careerai-476016", location="us-central1")

# Configuration
GEMINI_API_KEY = "AIzaSyBmknnBd4p_6nt81OMHcKnlj4SqPeUg0pk"
gemini_model  = ChatVertexAI(
                model="gemini-2.5-flash",
                temperature=0.7,
                max_retries=2
            )

# Configure Gemini API for job details generation
if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model  = ChatVertexAI(
                model="gemini-2.5-flash",
                temperature=0.7,
                max_retries=2
            )
        print("✅ Gemini 2.5-flash model initialized for job details")
    except Exception as e:
        print(f"❌ Error initializing Gemini model: {e}")
        gemini_model = None
else:
    gemini_model = None
    print("ℹ️ No valid Gemini API key found for job details")

# Simple in-memory chat history storage
chat_history: List[Dict[str, str]] = []

# Pydantic Models for Student Career Advisory
class CareerAdvisoryRequest(BaseModel):
    """Request model for student career advisory API"""
    class_level: str = Field(..., description="Student's current class/education level")
    academic_performance: str = Field(..., description="Academic performance (percentage/CGPA)")
    stream: str = Field(..., description="Academic stream (science, commerce, arts, etc.)")
    interests: List[str] = Field(..., description="List of student's interests")
    budget: str = Field(..., description="Budget range for education/skills")
    location_preference: str = Field(..., description="Preferred location")
    competitive_exam_interest: bool = Field(..., description="Interest in competitive exams")
    career_type_preference: str = Field(..., description="Preferred career type (government, private, etc.)")
    technical_skills: Optional[List[str]] = Field(None, description="Optional list of technical skills")
    soft_skills: Optional[List[str]] = Field(None, description="Optional list of soft skills")
    additional_info: Optional[str] = Field(None, description="Optional additional information")

# Pydantic Models for Professional Career Advisory
class ProfessionalAdvisoryRequest(BaseModel):
    """Request model for professional career advisory API"""
    current_status: str = Field(..., description="Current professional status (employed, unemployed, freelancing, etc.)")
    career_goals: str = Field(..., description="Professional career goals and aspirations")
    skill_assessment: Dict[str, str] = Field(..., description="Self-assessed skill levels for various competencies")
    experience_gaps: str = Field(..., description="Years of experience or experience level")
    work_preferences: str = Field(..., description="Work environment and culture preferences")
    learning_development: str = Field(..., description="Learning and development goals")
    current_challenges: List[str] = Field(..., description="Current career challenges being faced")
    target_applications: str = Field(..., description="Target industries or companies of interest")

# Response Models
class CareerAdvisoryResponse(BaseModel):
    """Response model for career advisory API"""
    success: bool
    message: str
    advice: str
    error: Optional[str] = None

class APIResponse(BaseModel):
    """Generic API response model"""
    success: bool
    message: str
    data: Optional[dict] = None
    error: Optional[str] = None


# -----------------------------
# Job Recommendation Models
# -----------------------------
class JobRecommendationRequest(BaseModel):
    """Request body for job recommendation API"""
    text: str = Field(..., description="Resume text or skills text")
    top_n: int = Field(5, ge=1, le=20, description="Number of jobs to return")


class JobMatch(BaseModel):
    job_title: str
    city: Optional[str] = None
    state: Optional[str] = None
    salary: Optional[str] = None
    match_score: float


class JobRecommendationResponse(BaseModel):
    success: bool
    message: str
    matches: List[JobMatch]
    error: Optional[str] = None

# Chat Models
class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    history: List[Dict[str, str]]

# Job Details Models
class JobTitleInput(BaseModel):
    job_title: str

class JobDetailsResponse(BaseModel):
    job_description: str
    day_in_life: List[str]

# Skill Gap Analysis Models
class SkillAnalysisRequest(BaseModel):
    current_skills: str
    target_skills: str

class SkillAnalysisResponse(BaseModel):
    summary: str
    existing_skills: List[str]
    missing_skills: List[str]
    learning_path: List[str]
    timeline: str
    confidence_score: float

class SkillChatRequest(BaseModel):
    message: str
    context: Optional[Dict] = None

class SkillChatResponse(BaseModel):
    response: str

# Service Layer
class CareerAdvisoryService:
    """Service class to handle career advisory business logic"""

    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self._setup_environment()

    def _setup_environment(self):
        """Setup environment variables"""
        os.environ["GOOGLE_API_KEY"] = self.api_key
        # Lazy holders for job reco artifacts
        self._vectorizer = None
        self._job_matrix = None
        self._jobs_df = None

    def get_student_career_advice(self, request: CareerAdvisoryRequest) -> CareerAdvisoryResponse:
        """
        Main service method to process student career advisory request

        Args:
            request: CareerAdvisoryRequest object

        Returns:
            CareerAdvisoryResponse: Response with advice or error
        """
        try:
            # Generate prompt from request
            prompt = self._generate_student_career_prompt(request)

            # Execute LLM with the generated prompt
            llm_response = self._execute_llm(prompt)

            return CareerAdvisoryResponse(
                success=True,
                message="Career advice generated successfully",
                advice=llm_response
            )

        except Exception as e:
            return CareerAdvisoryResponse(
                success=False,
                message="Failed to generate career advice",
                advice="",
                error=str(e)
            )

    def get_professional_advice(self, request: ProfessionalAdvisoryRequest) -> CareerAdvisoryResponse:
        """
        Main service method to process professional career advisory request

        Args:
            request: ProfessionalAdvisoryRequest object

        Returns:
            CareerAdvisoryResponse: Response with advice or error
        """
        try:
            # Generate prompt from request
            prompt = self._generate_professional_prompt(request)

            # Execute LLM with the generated prompt
            llm_response = self._execute_llm(prompt)

            return CareerAdvisoryResponse(
                success=True,
                message="Professional career advice generated successfully",
                advice=llm_response
            )

        except Exception as e:
            return CareerAdvisoryResponse(
                success=False,
                message="Failed to generate professional career advice",
                advice="",
                error=str(e)
            )

    def _generate_student_career_prompt(self, request: CareerAdvisoryRequest) -> str:
        """
        Generate a comprehensive prompt for the LLM based on student user parameters

        Args:
            request: CareerAdvisoryRequest object

        Returns:
            str: Formatted prompt for LLM
        """

        prompt = f"""You are an expert Career Skills Advisor. Please provide comprehensive career guidance based on the following student profile:

STUDENT PROFILE:
- Education Level: {request.class_level}
- Academic Performance: {request.academic_performance}
- Academic Stream: {request.stream.title()}
- Primary Interests: {', '.join(request.interests)}
- Available Budget: {request.budget}
- Location Preference: {request.location_preference}
- Career Type Preference: {request.career_type_preference.title()}

ACHIEVEMENTS AND EXPERIENCE:
- Competitive Exams Interest: {'Yes' if request.competitive_exam_interest else 'No'}"""

        # Add optional fields if available
        if request.technical_skills:
            prompt += f"\n- Technical Skills: {', '.join(request.technical_skills)}"

        if request.soft_skills:
            prompt += f"\n- Soft Skills: {', '.join(request.soft_skills)}"

        if request.additional_info:
            prompt += f"\n- Additional Information: {request.additional_info}"

        # Add specific requirements for the AI response
        prompt += """

Please provide detailed advice covering:

## CAREER PATH RECOMMENDATIONS
- Top 3-5 suitable career options with specific job roles
- Growth prospects and industry trends
- Future opportunities in the field

## SKILLS DEVELOPMENT PLAN
- Essential technical skills to acquire
- Important soft skills to develop
- Recommended learning resources and timeline

## EDUCATION & CERTIFICATION
- Suitable courses and certifications within budget
- Institution recommendations
- Alternative learning paths

## COMPETITIVE EXAM STRATEGY
- Relevant exams for chosen career path
- Preparation strategy and timeline
- Best resources and coaching options

## ACTION PLAN
- Short-term goals (3-6 months)
- Medium-term goals (6-18 months)
- Long-term milestones (2-5 years)

## INDUSTRY INSIGHTS
- Market trends and salary expectations
- Networking opportunities
- Career progression paths

**Important:** Use clear headings with emojis, bullet points for lists, and bold text for emphasis. Make the content easy to read and well-structured. Make sure your response is complete. Do not cut off mid-sentence."""

        return prompt

    def _generate_professional_prompt(self, request: ProfessionalAdvisoryRequest) -> str:
        """
        Generate a comprehensive prompt for the LLM based on professional user parameters

        Args:
            request: ProfessionalAdvisoryRequest object

        Returns:
            str: Formatted prompt for LLM
        """

        prompt = f"""You are an expert Professional Career Advisor specializing in career advancement, transitions, and professional development. Please provide comprehensive career guidance based on the following professional profile:

PROFESSIONAL PROFILE:
- Current Status: {request.current_status}
- Experience Level: {request.experience_gaps}
- Career Goals: {request.career_goals}
- Work Preferences: {request.work_preferences}
- Learning & Development Goals: {request.learning_development}
- Target Industries/Companies: {request.target_applications}

SKILL ASSESSMENT:"""

        # Add skill assessment details
        if request.skill_assessment:
            for skill, level in request.skill_assessment.items():
                if level:  # Only include skills with assessment
                    prompt += f"\n- {skill}: {level}"

        prompt += f"""

CURRENT CHALLENGES:
- {', '.join(request.current_challenges) if request.current_challenges else 'None specified'}

Please provide detailed professional career advice covering:

## CAREER ADVANCEMENT STRATEGY
- Analysis of current position and growth opportunities
- Strategic career moves for next 2-5 years
- Leadership development recommendations
- Industry positioning and personal branding

## SKILL DEVELOPMENT ROADMAP
- Critical skills to develop based on career goals
- Technical competencies to acquire or strengthen
- Leadership and management skills enhancement
- Industry-specific certifications and training

## TRANSITION PLANNING
- Steps for career transition or industry change
- Risk mitigation strategies
- Timeline and milestones for transition
- Networking and relationship building

## PROFESSIONAL DEVELOPMENT
- Learning opportunities and resources
- Mentorship and coaching recommendations
- Professional certifications and courses
- Conference and networking events

## COMPENSATION & NEGOTIATION
- Salary benchmarking and expectations
- Negotiation strategies for promotions/new roles
- Benefits and compensation package optimization
- Performance review preparation

## INDUSTRY INSIGHTS & MARKET TRENDS
- Current market conditions in target industries
- Emerging opportunities and threats
- Future skill requirements and trends
- Company analysis and cultural fit assessment

## ACTION PLAN
- Immediate actions (next 30 days)
- Short-term goals (3-6 months)
- Medium-term objectives (6-18 months)
- Long-term career milestones (2-5 years)

## CHALLENGE RESOLUTION
- Specific strategies to address current challenges
- Risk management and contingency planning
- Work-life balance optimization
- Stress management and productivity tips

**Important:** Use clear headings with emojis, bullet points for lists, and bold text for emphasis. Make the content easy to read and well-structured. Make sure your response is complete. Do not cut off mid-sentence."""

        return prompt

    def _execute_llm(self, prompt: str) -> str:
        """
        Execute the LLM with the generated prompt using Google Gemini

        Args:
            prompt: The generated prompt for the LLM

        Returns:
            str: Response from the LLM
        """
        try:
            # Initialize the LLM with proper error handling and timeout
            llm = ChatVertexAI(
                model="gemini-2.5-flash",
                temperature=0.7,
                max_tokens=5000,
                max_retries=2
            )

            # Invoke the LLM with the prompt
            response = llm.invoke(prompt)
            return response.content.strip()

        except Exception as e:
            # Log error and return mock response for testing
            print(f"LLM Execution Error: {str(e)}")
            # Check if it's a quota exceeded error
            if "quota" in str(e).lower() or "429" in str(e):
                print("API quota exceeded, returning fallback response...")
                return self._generate_quota_exceeded_response()
            return self._generate_mock_response()

    # -----------------------------
    # Job Recommendation Service
    # -----------------------------
    def _resolve_artifact_path(self, filename: str) -> Optional[str]:
        """Try common locations for artifacts and return first existing path.

        Order of precedence:
        - JOB_ARTIFACTS_DIR env var (if set)
        - backend/artifacts/
        - project_root/artifacts/ (parent of backend)
        - backend/
        - project_root/
        """
        backend_dir = os.path.dirname(__file__)
        project_root = os.path.abspath(os.path.join(backend_dir, os.pardir))
        env_dir = os.environ.get("JOB_ARTIFACTS_DIR")

        candidates = []
        if env_dir:
            candidates.append(os.path.join(env_dir, filename))
        candidates.extend([
            os.path.join(backend_dir, "artifacts", filename),
            os.path.join(project_root, "artifacts", filename),
            os.path.join(backend_dir, filename),
            os.path.join(project_root, filename),
            os.path.join(os.getcwd(), "artifacts", filename),
            os.path.join(os.getcwd(), filename),
        ])
        for path in candidates:
            if os.path.exists(path):
                return path
        return None

    def _ensure_artifacts_loaded(self) -> None:
        """Load TF-IDF artifacts and jobs DataFrame if not already loaded."""
        if self._vectorizer is not None and self._job_matrix is not None and self._jobs_df is not None:
            return

        vectorizer_path = self._resolve_artifact_path("vectorizer.pkl")
        job_matrix_path = self._resolve_artifact_path("job_matrix.pkl")
        jobs_csv_path = self._resolve_artifact_path("jobs_processed.csv")

        # If CSV exists but pickles are missing, build artifacts automatically
        if jobs_csv_path and (not vectorizer_path or not job_matrix_path):
            self._build_and_save_artifacts(jobs_csv_path)
            # Re-resolve after building
            vectorizer_path = self._resolve_artifact_path("vectorizer.pkl")
            job_matrix_path = self._resolve_artifact_path("job_matrix.pkl")

        if not vectorizer_path or not job_matrix_path or not jobs_csv_path:
            missing = []
            if not vectorizer_path:
                missing.append("vectorizer.pkl")
            if not job_matrix_path:
                missing.append("job_matrix.pkl")
            if not jobs_csv_path:
                missing.append("jobs_processed.csv")
            hint = (
                "Missing artifacts: " + ", ".join(missing) +
                ". Place them in 'backend/artifacts/' or set JOB_ARTIFACTS_DIR to the directory containing them."
            )
            raise FileNotFoundError(hint)

        self._vectorizer = joblib.load(vectorizer_path)
        self._job_matrix = joblib.load(job_matrix_path)
        self._jobs_df = pd.read_csv(jobs_csv_path)

    def _build_and_save_artifacts(self, jobs_csv_path: str) -> None:
        """Build TF-IDF artifacts from jobs CSV and persist them under backend/artifacts."""
        df = pd.read_csv(jobs_csv_path)
        if "Job Title" not in df.columns:
            raise FileNotFoundError("'jobs_processed.csv' must contain a 'Job Title' column")
        texts = df["Job Title"].astype(str).fillna("")
        vectorizer = TfidfVectorizer(stop_words="english")
        vectorizer.fit(texts)
        job_matrix = vectorizer.transform(texts)

        backend_dir = os.path.dirname(__file__)
        artifacts_dir = os.path.join(backend_dir, "artifacts")
        os.makedirs(artifacts_dir, exist_ok=True)
        joblib.dump(vectorizer, os.path.join(artifacts_dir, "vectorizer.pkl"))
        joblib.dump(job_matrix, os.path.join(artifacts_dir, "job_matrix.pkl"))

    def get_job_recommendations(self, text: str, top_n: int = 5) -> List[JobMatch]:
        """Compute cosine similarity between candidate text and job matrix and return top matches."""
        self._ensure_artifacts_loaded()
        cand_vec = self._vectorizer.transform([text])
        scores = cosine_similarity(cand_vec, self._job_matrix).flatten()
        top_indices = scores.argsort()[-top_n:][::-1]
        recs = self._jobs_df.iloc[top_indices][["Job Title", "City", "State", "Salary"]].copy()
        recs = recs.fillna("")
        matches: List[JobMatch] = []
        for idx, score in zip(top_indices, scores[top_indices]):
            row = self._jobs_df.iloc[idx]

            # Clean up location data
            city = str(row.get("City", "")).strip()
            state = str(row.get("State", "")).strip()

            # Handle cases where both city and state are "India" or similar
            if city == "India" and state == "India":
                city = "Remote"
                state = "India"
            elif city == state and city in ["India", "Remote"]:
                city = "Remote"
                state = "India"

            # Clean up empty or None values
            city = city if city and city != "nan" else None
            state = state if state and state != "nan" else None

            matches.append(
                JobMatch(
                    job_title=str(row.get("Job Title", "")),
                    city=city,
                    state=state,
                    salary=str(row.get("Salary", "")) or None,
                    match_score=float(score),
                )
            )
        return matches

    def get_gemini_chat_response(self, user_message: str, history: List[Dict[str, str]]) -> str:
        """Get response from Gemini AI with career guidance system prompt."""
        try:
            # Try to use Gemini if API key is available
            if not self.api_key:
                return "I'm a career guidance chatbot! I'm here to help with career advice, job search tips, skill development, and professional growth. However, I need a Gemini API key to provide personalized responses. For now, I can suggest exploring career resources online!"

            # Create the model
            llm = ChatVertexAI(
                model="gemini-2.5-flash",
                temperature=0.7,
                max_tokens=5000,
                max_retries=2
            )

            # Build the conversation context
            system_prompt = """You are a helpful career guidance chatbot. Your role is to:
- Provide career advice and guidance
- Help with job search strategies
- Suggest skill development opportunities
- Offer interview preparation tips
- Discuss career transitions and growth
- Answer questions about different professions

Be supportive, professional, and encouraging. Keep responses concise but helpful."""

            # Build conversation history for context
            conversation = system_prompt + "\n\nConversation history:\n"
            for msg in history[-10:]:  # Keep last 10 messages for context
                conversation += f"User: {msg['user']}\nBot: {msg['bot']}\n"

            conversation += f"\nUser: {user_message}\nBot:"

            # Generate response
            response = llm.invoke(conversation)
            return response.content.strip()

        except Exception as e:
            print(f"Error with Gemini API: {e}")
            # Fallback response
            return f"I'm a career guidance chatbot here to help! I can assist with career advice, job search tips, skill development, and professional growth. How can I help you today? (Note: Gemini API error - using fallback response)"

    def generate_job_description(self, job_title: str) -> str:
        """Generate concise job description using Gemini directly"""
        if not gemini_model:
            return f"Entry-level {job_title} role involving coding, testing, and learning new technologies under mentorship."

        try:
            prompt = f"Write a brief 2-3 sentence job description for a {job_title} role. Focus on main responsibilities and keep it concise for a UI card."
            response = gemini_model.invoke(prompt)

            text = response.text() if callable(response.text) else response.text

            if not text:
                content = f"Entry-level {job_title} role involving coding, testing, and learning new technologies under mentorship."
            else:
                content = text.strip()

            # Limit to approximately 150 characters for UI
            if len(content) > 150:
                content = content[:147] + "..."
            return content if content else f"Entry-level {job_title} role involving coding, testing, and learning new technologies under mentorship."

        except Exception as e:
            print(f"❌ Error generating job description with Gemini: {e}")
            return f"Entry-level {job_title} role involving coding, testing, and learning new technologies under mentorship."

    def generate_day_in_life_points(self, job_title: str) -> List[str]:
        """Generate concise day in life points using Gemini directly"""
        # Create job-specific fallback content instead of generic
        job_specific_fallbacks = {
            "java": ["Morning code review", "Java development tasks", "Unit testing", "Documentation updates"],
            "python": ["Data analysis work", "Python scripting", "Code optimization", "Team collaboration"],
            "coding": ["Morning standup", "Feature development", "Code testing", "Bug fixes"],
            "fresher": ["Learning new technologies", "Code review sessions", "Mentor meetings", "Project assignments"],
            "developer": ["Code development", "Testing and debugging", "Team meetings", "Code reviews"],
            "software": ["System design", "Code implementation", "Testing phases", "Deployment tasks"]
        }

        # Find matching fallback based on job title
        fallback_points = [
            "Morning standup meetings",
            "Code development and review",
            "Team collaboration sessions",
            "Problem-solving and debugging"
        ]

        for keyword, points in job_specific_fallbacks.items():
            if keyword.lower() in job_title.lower():
                fallback_points = points
                break

        if not gemini_model:
            return fallback_points

        try:
            prompt = f"List 4 short daily activities for a {job_title} role. Each activity should be 3-6 words maximum. Format as simple bullet points."
            response = gemini_model.invoke(prompt)

            text = response.text() if callable(response.text) else response.text
            if not text:
                return fallback_points
            else:
                content = text.strip()

            # Extract points from the response
            points = []

            # Try different splitting methods
            lines = content.split('\n')
            for line in lines:
                clean_line = line.strip().strip('•-*123456789.').strip()
                if clean_line and len(clean_line) > 3 and len(clean_line) < 50:
                    points.append(clean_line)

            # If we have enough points, return first 4
            if len(points) >= 4:
                return points[:4]

            # Try splitting by sentences
            sentences = content.replace('. ', '.|').replace('! ', '!|').replace('? ', '?|').split('|')
            for sentence in sentences:
                clean_sentence = sentence.strip().strip('.-!?').strip()
                if clean_sentence and len(clean_sentence) > 3 and len(clean_sentence) < 50:
                    points.append(clean_sentence)

            if len(points) >= 4:
                return points[:4]

            # Return job-specific fallback
            return fallback_points

        except Exception as e:
            print(f"❌ Error generating day in life with Gemini: {e}")
            return fallback_points

    def _generate_quota_exceeded_response(self) -> str:
        """Generate a response when API quota is exceeded"""
        return """## CAREER PATH RECOMMENDATIONS

Based on your profile, here are some excellent career paths:

* **Software Engineer:** High demand field with excellent growth prospects
* **Data Scientist:** Combines technical skills with analytical thinking
* **Web Developer:** Creative field with good job opportunities
* **AI/ML Engineer:** Emerging field with high potential
* **Product Manager:** Bridge between technology and business

## SKILLS DEVELOPMENT PLAN

**Essential Technical Skills:**
* Programming languages (Python, JavaScript, Java, C++)
* Database management (SQL, NoSQL, MongoDB)
* Version control (Git, GitHub)
* Cloud platforms (AWS, Azure, Google Cloud)
* Data analysis tools (Excel, Tableau, Power BI)

**Important Soft Skills:**
* Communication and presentation skills
* Problem-solving and critical thinking
* Teamwork and collaboration
* Leadership and project management
* Continuous learning mindset

## EDUCATION & CERTIFICATION

**Recommended Learning Path:**
* Online courses and bootcamps (Coursera, Udemy, edX)
* Industry certifications (AWS, Google Cloud, Microsoft)
* Practical projects and portfolio development
* Internships and real-world experience
* Open source contributions

## ACTION PLAN

**Short-term Goals (3-6 months):**
* Complete foundational programming courses
* Build 2-3 portfolio projects
* Join coding communities and forums
* Start networking with professionals

**Medium-term Goals (6-18 months):**
* Specialize in chosen field
* Gain practical experience through internships
* Obtain relevant certifications
* Build strong professional network

**Long-term Milestones (2-5 years):**
* Secure entry-level position in target field
* Continue learning and upskilling
* Advance to senior/leadership roles
* Consider specialization or entrepreneurship

## INDUSTRY INSIGHTS

**Market Trends:**
* Tech industry continues rapid growth
* High demand for AI/ML and data science skills
* Remote work opportunities increasing
* Focus on digital transformation across industries

**Salary Expectations:**
* Entry-level: $50,000 - $80,000
* Mid-level: $80,000 - $120,000
* Senior-level: $120,000 - $200,000+
* Varies by location, company, and specialization

**Career Progression:**
* Junior → Senior → Lead → Manager → Director
* Technical track: Individual Contributor → Architect → Principal
* Management track: Team Lead → Manager → VP → CTO

---

**Note:** This response was generated using fallback content due to API quota limits. For more personalized and detailed advice, please try again later or contact our support team."""

    def _generate_mock_response(self) -> str:
        """Generate a mock response when LLM fails"""
        return """
CAREER ADVISORY RESPONSE (Mock Response - LLM Connection Failed)

Based on your profile, here are preliminary recommendations:

CAREER PATH RECOMMENDATIONS:
1. Software Engineering - High demand in tech sector
2. Data Science & Analytics - Growing field with good prospects
3. Product Management - Bridge between tech and business
4. Cybersecurity - Critical need in all industries
5. AI/ML Engineering - Future-focused career path

SKILLS DEVELOPMENT PLAN:
Technical Skills to Develop:
- Programming: Python, JavaScript, SQL
- Data Analysis: Excel, Tableau, Power BI
- Cloud Platforms: AWS, Azure basics
- Version Control: Git/GitHub

Soft Skills to Focus:
- Problem-solving and analytical thinking
- Communication and presentation skills
- Project management
- Leadership and teamwork

EDUCATION & CERTIFICATION:
- Consider Computer Science or related engineering degree
- Online certifications: Coursera, edX, Udemy courses
- Professional certifications: AWS, Google Cloud, Microsoft
- Bootcamps for intensive skill building

ACTION PLAN:
Short-term (3-6 months):
- Complete 2-3 online programming courses
- Build 2-3 portfolio projects
- Join coding communities and forums

Medium-term (6-18 months):
- Apply for internships or entry-level positions
- Contribute to open-source projects
- Network with professionals in chosen field

Long-term (2-5 years):
- Gain 2+ years professional experience
- Pursue advanced certifications
- Consider specialization in AI/ML or cybersecurity

INDUSTRY INSIGHTS:
- Starting salaries: 3-8 LPA for freshers
- Mid-level (3-5 years): 8-18 LPA
- Senior level (5+ years): 15-35+ LPA
- Location: Mumbai/Bangalore offer best opportunities

Note: This is a mock response. Please fix the API connection to get personalized advice from Gemini AI.
        """

# Skill Gap Analysis Methods
def analyze_skill_gap(current_skills: str, target_skills: str) -> Dict[str, Any]:
    """Analyze skill gap using Gemini AI"""
    try:
        current_skills = current_skills.replace("\\", "\\\\").replace("\n", "\\n")
        target_skills = target_skills.replace("\\", "\\\\").replace("\n", "\\n")

        # Create a fresh model instance with proper configuration
        llm = ChatVertexAI(
            model="gemini-2.5-flash",
            temperature=0.7,
            max_tokens=2000,
            max_retries=2
        )

        prompt = f"""
You are an expert career counselor and skill gap analyst. Analyze the gap between current skills and target requirements.

Current Skills and Experience:
{json.dumps(current_skills)}

Target Skills/Job Requirements:
{json.dumps(target_skills)}

Please provide a comprehensive analysis in the following JSON format:

{{
    "summary": "A detailed 2-3 sentence summary of the overall skill gap and career readiness",
    "existing_skills": ["List of skills the person already has that match the target"],
    "missing_skills": ["List of skills that need to be developed"],
    "learning_path": ["Step-by-step learning recommendations in order of priority"],
    "timeline": "Realistic time estimate to bridge the gap (e.g., '6-12 months')",
    "confidence_score": 0.85
}}

Guidelines:
- Be specific and actionable in recommendations
- Consider both technical and soft skills
- Provide realistic timelines
- Confidence score should be between 0.0 and 1.0
- Focus on practical, achievable steps
- Consider the person's existing experience level

Respond ONLY with valid, **complete**, and **strictly valid JSON**.
Include maximum 5 brief points in learning path.
Do not include any commentary, explanation, or markdown formatting.
If you are unsure, still produce syntactically valid JSON.
"""

        response = llm.invoke(prompt)

        if not response.content:
            return create_fallback_skill_analysis()

        content = response.content.strip()

        # Clean the response in case there are markdown code blocks
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        try:
            # Extract JSON substring if model added any text outside it
            match = re.search(r"\{[\s\S]*\}", content)
            if match:
                json_str = match.group(0)
            else:
                json_str = content

            result = json.loads(json_str)

        except json.JSONDecodeError as e:
            print("⚠️ Gemini returned malformed JSON.")
            print("Raw content:\n", content)
            print("JSON Error:", e)
            return create_fallback_skill_analysis()

        # Validate required fields
        required_fields = ["summary", "existing_skills", "missing_skills", "learning_path", "timeline", "confidence_score"]
        for field in required_fields:
            if field not in result:
                result[field] = get_default_skill_value(field)

        # Ensure confidence_score is valid
        if not isinstance(result["confidence_score"], (int, float)) or not 0 <= result["confidence_score"] <= 1:
            result["confidence_score"] = 0.7

        # Ensure lists are actually lists
        for list_field in ["existing_skills", "missing_skills", "learning_path"]:
            if not isinstance(result[list_field], list):
                result[list_field] = []

        return result

    except Exception as e:
        print(f"❌ Error analyzing skill gap with Gemini: {e}")
        return create_fallback_skill_analysis()

def create_fallback_skill_analysis() -> Dict[str, Any]:
    """Create a fallback analysis when the main analysis fails"""
    return {
        "summary": "I've received your skill information and target goals. While I encountered some technical difficulties with the detailed analysis, I can see you have experience to build upon.",
        "existing_skills": [
            "Experience in your current field",
            "Foundation skills mentioned in your profile"
        ],
        "missing_skills": [
            "Specific skills mentioned in target role",
            "Advanced techniques and tools",
            "Industry-specific knowledge"
        ],
        "learning_path": [
            "Review the target role requirements in detail",
            "Identify the most critical missing skills",
            "Create a structured learning plan",
            "Practice with hands-on projects",
            "Seek mentorship or guidance",
            "Build a portfolio demonstrating new skills"
        ],
        "timeline": "6-12 months",
        "confidence_score": 0.6
    }

def get_default_skill_value(field: str):
    """Get default value for missing fields"""
    defaults = {
        "summary": "Analysis completed. Please review the detailed breakdown below.",
        "existing_skills": [],
        "missing_skills": [],
        "learning_path": [],
        "timeline": "3-6 months",
        "confidence_score": 0.7
    }
    return defaults.get(field, "")

def generate_skill_chat_response(message: str, context: Optional[Dict] = None) -> str:
    """Generate a chat response about skill analysis"""
    if not gemini_model:
        return "I'm here to help with your skill gap analysis! I can provide career advice and learning recommendations. How can I assist you today?"

    try:
        context_info = ""
        if context:
            context_info = f"""
Previous Analysis Context:
- Summary: {context.get('summary', 'N/A')}
- Existing Skills: {', '.join(context.get('existing_skills', []))}
- Missing Skills: {', '.join(context.get('missing_skills', []))}
- Timeline: {context.get('timeline', 'N/A')}
"""

        prompt = f"""
You are a helpful career counselor chatbot. The user has completed a skill gap analysis and now has a follow-up question.

{context_info}

User's Question: {message}

Please provide a helpful, encouraging, and specific response. Keep it conversational but informative. If the user asks about learning resources, provide specific recommendations. If they ask about career advice, be supportive and realistic.

Guidelines:
- Be conversational and friendly
- Provide actionable advice
- Reference their analysis when relevant
- Keep responses focused and helpful
- Encourage continuous learning
- Be realistic about timelines and expectations
"""

        response = gemini_model.invoke(prompt)
        return response.content.strip() if response.content else "I'm here to help with your skill gap analysis! How can I assist you today?"

    except Exception as e:
        print(f"❌ Error generating skill chat response with Gemini: {e}")
        return "I'm here to help with your skill gap analysis! I can provide career advice and learning recommendations. How can I assist you today?"

# Controller/Handler Functions (for FastAPI endpoints)
def create_career_advisory_service():
    """Factory function to create career advisory service"""
    return CareerAdvisoryService()

def handle_student_career_advice_request(request: CareerAdvisoryRequest) -> CareerAdvisoryResponse:
    """
    Handler function for student career advice endpoint
    This will be called by your FastAPI route
    """
    service = create_career_advisory_service()
    return service.get_student_career_advice(request)

def handle_professional_advice_request(request: ProfessionalAdvisoryRequest) -> CareerAdvisoryResponse:
    """
    Handler function for professional advice endpoint
    This will be called by your FastAPI route
    """
    service = create_career_advisory_service()
    return service.get_professional_advice(request)

def health_check() -> APIResponse:
    """Health check endpoint handler"""
    return APIResponse(
        success=True,
        message="Career Advisory API is running",
        data={"status": "healthy", "service": "career_advisory"}
    )

# FastAPI Application Setup
app = FastAPI(
    title="AI Career Counsellor API",
    description="AI-powered career guidance and skills advisory service for students and professionals",
    version="1.0.0"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "https://careerai-476016.web.app", "https://careerai-476016.firebaseapp.com", "https://careerai-app-458973355291.us-central1.run.app"],  # CORS Links
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# FastAPI Endpoints
@app.get("/")
async def root():
    """Root endpoint for API health check"""
    return {"message": "AI Career Counsellor API is running", "status": "healthy"}

@app.get("/health")
async def health_check_endpoint():
    """Health check endpoint"""
    return health_check()

@app.post("/api/student/career-advice", response_model=CareerAdvisoryResponse)
async def get_student_career_advice_endpoint(request: CareerAdvisoryRequest):
    """
    Main endpoint to get career advice based on student profile

    Args:
        request: CareerAdvisoryRequest with student details

    Returns:
        CareerAdvisoryResponse: AI-generated career advice
    """
    try:
        response = handle_student_career_advice_request(request)

        if not response.success:
            raise HTTPException(status_code=400, detail=response.error)

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/professional/career-advice", response_model=CareerAdvisoryResponse)
async def get_professional_advice_endpoint(request: ProfessionalAdvisoryRequest):
    """
    Main endpoint to get professional career advice based on professional profile

    Args:
        request: ProfessionalAdvisoryRequest with professional details

    Returns:
        CareerAdvisoryResponse: AI-generated professional career advice
    """
    try:
        response = handle_professional_advice_request(request)

        if not response.success:
            raise HTTPException(status_code=400, detail=response.error)

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/student/career-advice/sample")
async def get_student_sample_request():
    """Get a sample request format for student testing"""
    sample = {
        "class_level": "12th Grade",
        "academic_performance": "85%",
        "stream": "science",
        "interests": ["coding", "mathematics", "problem solving"],
        "budget": "2-5 lakhs",
        "location_preference": "Mumbai or Bangalore",
        "competitive_exam_interest": True,
        "career_type_preference": "private",
        "technical_skills": ["Python", "HTML/CSS"],
        "soft_skills": ["Leadership", "Team work"],
        "additional_info": "Interested in AI and Machine Learning"
    }
    return {"sample_request": sample}

@app.get("/api/professional/career-advice/sample")
async def get_professional_sample_request():
    """Get a sample request format for professional testing"""
    sample = {
        "current_status": "employed",
        "career_goals": "I want to transition into a senior management role in the tech industry within the next 2-3 years and eventually become a CTO.",
        "skill_assessment": {
            "Technical Skills": "Advanced",
            "Communication": "Intermediate",
            "Leadership": "Intermediate",
            "Problem Solving": "Advanced",
            "Project Management": "Intermediate",
            "Team Collaboration": "Advanced",
            "Time Management": "Intermediate",
            "Creativity": "Advanced"
        },
        "experience_gaps": "5-10 years",
        "work_preferences": "I prefer a collaborative work environment with opportunities for innovation and growth. I value work-life balance and flexible working arrangements.",
        "learning_development": "I want to develop my leadership and management skills, learn about business strategy, and stay updated with emerging technologies.",
        "current_challenges": ["Career Growth", "Leadership Opportunities", "Skill Gap"],
        "target_applications": "Tech companies like Google, Microsoft, startups in AI/ML space, and fintech companies"
    }
    return {"sample_request": sample}


# -----------------------------
# Job Recommendation Endpoints
# -----------------------------
@app.post("/api/jobs/recommend", response_model=JobRecommendationResponse)
async def recommend_jobs_endpoint(req: JobRecommendationRequest):
    try:
        service = create_career_advisory_service()
        matches = service.get_job_recommendations(req.text, req.top_n)
        return JobRecommendationResponse(
            success=True,
            message="Job recommendations generated successfully",
            matches=matches,
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")

# -----------------------------
# Chat Endpoints
# -----------------------------
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_message: ChatMessage):
    """Handle chat messages and return AI responses."""
    try:
        user_message = chat_message.message.strip()
        if not user_message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        # Get AI response
        service = create_career_advisory_service()
        bot_response = service.get_gemini_chat_response(user_message, chat_history)

        # Add to chat history
        chat_entry = {
            "user": user_message,
            "bot": bot_response
        }
        chat_history.append(chat_entry)

        # Keep only last 50 messages to prevent memory issues
        if len(chat_history) > 50:
            chat_history.pop(0)

        return ChatResponse(
            response=bot_response,
            history=chat_history
        )

    except Exception as e:
        print(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.delete("/chat/history")
async def clear_chat_history():
    """Clear chat history."""
    global chat_history
    chat_history.clear()
    return {"message": "Chat history cleared"}

# -----------------------------
# Job Details Endpoints
# -----------------------------
@app.post("/api/job-details", response_model=JobDetailsResponse)
async def generate_job_details(job_input: JobTitleInput):
    """
    Generate job description and day in life details using Gemini AI
    """
    try:
        job_title = job_input.job_title.strip()

        if not job_title:
            raise HTTPException(status_code=400, detail="Job title cannot be empty")

        # Generate job details using the service
        service = create_career_advisory_service()
        job_description = service.generate_job_description(job_title)
        day_in_life = service.generate_day_in_life_points(job_title)

        return JobDetailsResponse(
            job_description=job_description,
            day_in_life=day_in_life
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating job details: {str(e)}")

# -----------------------------
# Skill Gap Analysis Endpoints
# -----------------------------
@app.post("/api/analyze-skills", response_model=SkillAnalysisResponse)
async def analyze_skills(request: SkillAnalysisRequest):
    """
    Analyze skill gap between current skills and target requirements
    """
    try:
        current_skills = request.current_skills.strip()
        target_skills = request.target_skills.strip()

        if not current_skills or not target_skills:
            raise HTTPException(status_code=400, detail="Both current skills and target skills are required")

        # Perform the skill gap analysis
        analysis_result = analyze_skill_gap(
            current_skills=current_skills,
            target_skills=target_skills
        )

        return SkillAnalysisResponse(**analysis_result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skill analysis failed: {str(e)}")

@app.post("/api/skill-chat", response_model=SkillChatResponse)
async def skill_chat(request: SkillChatRequest):
    """
    Chat about skill gap analysis results
    """
    try:
        message = request.message.strip()
        context = request.context

        if not message:
            raise HTTPException(status_code=400, detail="Message is required")

        # Generate response based on the analysis context and user message
        response = generate_skill_chat_response(
            message=message,
            context=context
        )

        return SkillChatResponse(response=response)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

# ==================================
# CV Reviewer (Resume Review) API
# ==================================

class CVReviewer:
    def __init__(self):
        """Initialize the CV reviewer using Vertex AI (auto-auth)."""
        # Reuse global vertexai.init done above with project/location
        self.model = GenerativeModel("gemini-2.5-flash")

    def extract_text_from_pdf(self, pdf_file) -> str:
        """Extract text from uploaded PDF file."""
        try:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text() or ""
                text += page_text + "\n"
            if not text.strip():
                raise ValueError("No readable text found in PDF.")
            return text.strip()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

    def generate_cv_review(self, cv_text: str) -> dict:
        """Generate comprehensive CV review using Gemini model."""
        prompt = f"""
You are an expert HR professional and career coach. Review the following CV and provide structured feedback.

## 1. Overall Impression
## 2. Strengths
## 3. Areas for Improvement
## 4. Section-by-Section Analysis
## 5. Key Recommendations
## 6. Industry-Specific Advice
## 7. ATS Optimization Tips
## 8. Overall Score: X/10
## 9. Next Steps

CV Content:
{cv_text}
"""
        try:
            response = self.model.generate_content(prompt)
            if not getattr(response, "text", None):
                raise HTTPException(status_code=500, detail="Empty response from AI model.")
            return {"review": response.text, "status": "success"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating review: {str(e)}")


_cv_reviewer: CVReviewer | None = None


def _get_sample_pdf_path() -> str | None:
    """Try to resolve a sample.pdf for fallback from common locations."""
    backend_dir = os.path.dirname(__file__)
    project_root = os.path.abspath(os.path.join(backend_dir, os.pardir))
    candidates = [
        os.path.join(backend_dir, "sample.pdf"),
        os.path.join(project_root, "src", "assets", "sample.pdf"),
        os.path.join(project_root, "ai-career-counsellor", "src", "assets", "sample.pdf"),
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    return None


@app.on_event("startup")
async def _init_cv_reviewer():
    global _cv_reviewer
    try:
        _cv_reviewer = CVReviewer()
    except Exception as e:
        print(f"CV Reviewer init failed: {e}")
        _cv_reviewer = None


@app.post("/api/review-cv")
async def review_cv(file: UploadFile | None = File(default=None)):
    """Upload and review a CV/Resume PDF file. If no file, use fallback sample.pdf when available."""
    if _cv_reviewer is None:
        raise HTTPException(status_code=500, detail="Vertex AI model not initialized.")

    pdf_file = None
    filename = None

    try:
        if file is not None:
            filename = file.filename
            content = await file.read()
            pdf_file = io.BytesIO(content)
        else:
            sample_path = _get_sample_pdf_path()
            if not sample_path:
                raise HTTPException(status_code=400, detail="No file uploaded and fallback 'sample.pdf' not found.")
            with open(sample_path, "rb") as f:
                pdf_file = io.BytesIO(f.read())
            filename = os.path.basename(sample_path)

        cv_text = _cv_reviewer.extract_text_from_pdf(pdf_file)
        review_result = _cv_reviewer.generate_cv_review(cv_text)
        return JSONResponse(content={
            "review": review_result["review"],
            "filename": filename,
            "status": "success",
            "text_length": len(cv_text),
        })
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    # For testing locally
    print("Starting AI Career Counsellor API server...")
    PORT = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=PORT)
