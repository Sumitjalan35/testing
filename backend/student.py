import json
from typing import List, Optional
import os
from pydantic import BaseModel, Field
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Configuration
GEMINI_API_KEY = "AIzaSyAaQQ26dILHuZiVI9mEd2uAzLi4TM4asXY"

# Pydantic Models for Request/Response
class CareerAdvisoryRequest(BaseModel):
    """Request model for career advisory API"""
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

# Service Layer
class CareerAdvisoryService:
    """Service class to handle career advisory business logic"""

    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self._setup_environment()

    def _setup_environment(self):
        """Setup environment variables"""
        os.environ["GOOGLE_API_KEY"] = self.api_key

    def get_career_advice(self, request: CareerAdvisoryRequest) -> CareerAdvisoryResponse:
        """
        Main service method to process career advisory request

        Args:
            request: CareerAdvisoryRequest object

        Returns:
            CareerAdvisoryResponse: Response with advice or error
        """
        try:
            # Generate prompt from request
            prompt = self._generate_career_prompt(request)

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

    def _generate_career_prompt(self, request: CareerAdvisoryRequest) -> str:
        """
        Generate a comprehensive prompt for the LLM based on user parameters

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

1. CAREER PATH RECOMMENDATIONS:
   - Top 3-5 suitable career options
   - Specific job roles and growth prospects
   - Industry trends and future opportunities

2. SKILLS DEVELOPMENT PLAN:
   - Essential technical skills to acquire
   - Important soft skills to develop
   - Recommended learning resources and timeline

3. EDUCATION & CERTIFICATION:
   - Suitable courses and certifications
   - Institution recommendations within budget
   - Alternative learning paths

4. COMPETITIVE EXAM STRATEGY:
   - Relevant exams for chosen career path
   - Preparation strategy and timeline
   - Best resources and coaching options

5. ACTION PLAN:
   - Short-term goals (3-6 months)
   - Medium-term goals (6-18 months)
   - Long-term milestones (2-5 years)

6. INDUSTRY INSIGHTS:
   - Market trends and salary expectations
   - Networking opportunities
   - Career progression paths

Provide specific, actionable, and personalized advice considering the student's profile, interests, and constraints."""

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
            llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                api_key=self.api_key,
                temperature=0.7,
                max_tokens=4000,
                timeout=30,
                max_retries=2
            )

            # Invoke the LLM with the prompt
            response = llm.invoke(prompt)
            return response.content

        except Exception as e:
            # Log error and return mock response for testing
            print(f"LLM Execution Error: {str(e)}")
            return self._generate_mock_response()

    def _generate_mock_response(self) -> str:
        """Generate a mock response when LLM fails"""
        return """
CAREER SKILLS ADVISORY RESPONSE (Mock Response - LLM Connection Failed)

Based on your profile, here are preliminary recommendations:

🎯 CAREER PATH RECOMMENDATIONS:
1. Software Engineering - High demand in tech sector
2. Data Science & Analytics - Growing field with good prospects
3. Product Management - Bridge between tech and business
4. Cybersecurity - Critical need in all industries
5. AI/ML Engineering - Future-focused career path

💡 SKILLS DEVELOPMENT PLAN:
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

📚 EDUCATION & CERTIFICATION:
- Consider Computer Science or related engineering degree
- Online certifications: Coursera, edX, Udemy courses
- Professional certifications: AWS, Google Cloud, Microsoft
- Bootcamps for intensive skill building

📋 ACTION PLAN:
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

💰 INDUSTRY INSIGHTS:
- Starting salaries: 3-8 LPA for freshers
- Mid-level (3-5 years): 8-18 LPA
- Senior level (5+ years): 15-35+ LPA
- Location: Mumbai/Bangalore offer best opportunities

Note: This is a mock response. Please fix the API connection to get personalized advice from Gemini AI.
        """

# Controller/Handler Functions (for FastAPI endpoints)
def create_career_advisory_service():
    """Factory function to create career advisory service"""
    return CareerAdvisoryService()

def handle_career_advice_request(request: CareerAdvisoryRequest) -> CareerAdvisoryResponse:
    """
    Handler function for career advice endpoint
    This will be called by your FastAPI route
    """
    service = create_career_advisory_service()
    return service.get_career_advice(request)

def health_check() -> APIResponse:
    """Health check endpoint handler"""
    return APIResponse(
        success=True,
        message="Career Advisory API is running",
        data={"status": "healthy", "service": "career_advisory"}
    )

# Test/Demo function
def test_career_advisory():
    """Test function to demonstrate the service"""
    # Sample data as it might come from React frontend
    sample_request = CareerAdvisoryRequest(
        class_level="12th Grade",
        academic_performance="85%",
        stream="science",
        interests=["coding", "mathematics", "problem solving"],
        budget="2-5 lakhs",
        location_preference="Mumbai or Bangalore",
        competitive_exam_interest=True,
        career_type_preference="private",
        technical_skills=["Python", "HTML/CSS"],
        soft_skills=["Leadership", "Team work"],
        additional_info="Interested in AI and Machine Learning"
    )

    # Test the service
    response = handle_career_advice_request(sample_request)

    print("=== CAREER SKILLS ADVISORY RESPONSE ===")
    print(f"Success: {response.success}")
    print(f"Message: {response.message}")
    if response.success:
        print(f"Advice:\n{response.advice}")
    else:
        print(f"Error: {response.error}")
    print("=" * 50)

    return response

# FastAPI Application Setup
app = FastAPI(
    title="Career Advisory API",
    description="AI-powered career guidance and skills advisory service",
    version="1.0.0"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# FastAPI Endpoints
@app.get("/")
async def root():
    """Root endpoint for API health check"""
    return {"message": "Career Advisory API is running", "status": "healthy"}

@app.get("/health")
async def health_check_endpoint():
    """Health check endpoint"""
    return health_check()

@app.post("/career-advice", response_model=CareerAdvisoryResponse)
async def get_career_advice_endpoint(request: CareerAdvisoryRequest):
    """
    Main endpoint to get career advice based on student profile

    Args:
        request: CareerAdvisoryRequest with student details

    Returns:
        CareerAdvisoryResponse: AI-generated career advice
    """
    try:
        response = handle_career_advice_request(request)

        if not response.success:
            raise HTTPException(status_code=400, detail=response.error)

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/career-advice/sample")
async def get_sample_request():
    """Get a sample request format for testing"""
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

if __name__ == "__main__":
    # For testing locally
    print("Starting Career Advisory API server...")
    uvicorn.run("test:app", host="0.0.0.0", port=8000, reload=True)
