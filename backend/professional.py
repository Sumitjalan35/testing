import json
from typing import List, Optional, Dict
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

class ProfessionalAdvisoryResponse(BaseModel):
    """Response model for professional career advisory API"""
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
class ProfessionalAdvisoryService:
    """Service class to handle professional career advisory business logic"""

    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self._setup_environment()

    def _setup_environment(self):
        """Setup environment variables"""
        os.environ["GOOGLE_API_KEY"] = self.api_key

    def get_professional_advice(self, request: ProfessionalAdvisoryRequest) -> ProfessionalAdvisoryResponse:
        """
        Main service method to process professional career advisory request

        Args:
            request: ProfessionalAdvisoryRequest object

        Returns:
            ProfessionalAdvisoryResponse: Response with advice or error
        """
        try:
            # Generate prompt from request
            prompt = self._generate_professional_prompt(request)

            # Execute LLM with the generated prompt
            llm_response = self._execute_llm(prompt)

            return ProfessionalAdvisoryResponse(
                success=True,
                message="Professional career advice generated successfully",
                advice=llm_response
            )

        except Exception as e:
            return ProfessionalAdvisoryResponse(
                success=False,
                message="Failed to generate professional career advice",
                advice="",
                error=str(e)
            )

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

1. CAREER ADVANCEMENT STRATEGY:
   - Analysis of current position and growth opportunities
   - Strategic career moves for next 2-5 years
   - Leadership development recommendations
   - Industry positioning and personal branding

2. SKILL DEVELOPMENT ROADMAP:
   - Critical skills to develop based on career goals
   - Technical competencies to acquire or strengthen
   - Leadership and management skills enhancement
   - Industry-specific certifications and training

3. TRANSITION PLANNING (if applicable):
   - Steps for career transition or industry change
   - Risk mitigation strategies
   - Timeline and milestones for transition
   - Networking and relationship building

4. PROFESSIONAL DEVELOPMENT:
   - Learning opportunities and resources
   - Mentorship and coaching recommendations
   - Professional certifications and courses
   - Conference and networking events

5. COMPENSATION & NEGOTIATION:
   - Salary benchmarking and expectations
   - Negotiation strategies for promotions/new roles
   - Benefits and compensation package optimization
   - Performance review preparation

6. INDUSTRY INSIGHTS & MARKET TRENDS:
   - Current market conditions in target industries
   - Emerging opportunities and threats
   - Future skill requirements and trends
   - Company analysis and cultural fit assessment

7. ACTION PLAN:
   - Immediate actions (next 30 days)
   - Short-term goals (3-6 months)
   - Medium-term objectives (6-18 months)
   - Long-term career milestones (2-5 years)

8. CHALLENGE RESOLUTION:
   - Specific strategies to address current challenges
   - Risk management and contingency planning
   - Work-life balance optimization
   - Stress management and productivity tips

Provide specific, actionable, and personalized advice considering the professional's experience level, goals, challenges, and market conditions. Include concrete steps, resources, and timelines where applicable."""

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
PROFESSIONAL CAREER ADVISORY RESPONSE (Mock Response - LLM Connection Failed)

Based on your professional profile, here are preliminary recommendations:

🚀 CAREER ADVANCEMENT STRATEGY:
1. Leadership Development - Focus on building management skills
2. Strategic Thinking - Develop business acumen and strategic planning
3. Industry Expertise - Deepen domain knowledge in your field
4. Personal Branding - Build thought leadership and professional visibility

💼 SKILL DEVELOPMENT ROADMAP:
Technical Skills to Strengthen:
- Digital transformation technologies
- Data analysis and business intelligence
- Project management methodologies (Agile/Scrum)
- Industry-specific tools and platforms

Leadership Skills to Develop:
- Team management and delegation
- Strategic communication
- Change management
- Conflict resolution and negotiation

📈 PROFESSIONAL DEVELOPMENT:
- Executive education programs
- Industry certifications (PMP, Six Sigma, etc.)
- Professional networking and mentorship
- Speaking engagements and thought leadership

💰 COMPENSATION & NEGOTIATION:
- Research market salary benchmarks
- Document achievements and value proposition
- Prepare for annual review discussions
- Consider total compensation package

📋 ACTION PLAN:
Immediate (30 days):
- Update LinkedIn profile and resume
- Research target companies and roles
- Connect with industry mentors
- Set up informational interviews

Short-term (3-6 months):
- Complete relevant certification
- Apply for target positions
- Expand professional network
- Develop portfolio of achievements

Medium-term (6-18 months):
- Secure promotion or new role
- Lead high-visibility projects
- Establish thought leadership
- Build strategic relationships

Long-term (2-5 years):
- Achieve senior leadership position
- Become industry expert
- Mentor others in your field
- Consider entrepreneurial opportunities

🎯 CHALLENGE RESOLUTION:
- Address skill gaps through targeted learning
- Improve work-life balance through time management
- Build resilience and stress management skills
- Create backup plans for career security

💡 INDUSTRY INSIGHTS:
- Stay updated on market trends and disruptions
- Monitor competitor movements and strategies
- Identify emerging opportunities in your field
- Build relationships with industry leaders

Note: This is a mock response. Please fix the API connection to get personalized advice from Gemini AI.
        """

# Controller/Handler Functions (for FastAPI endpoints)
def create_professional_advisory_service():
    """Factory function to create professional advisory service"""
    return ProfessionalAdvisoryService()

def handle_professional_advice_request(request: ProfessionalAdvisoryRequest) -> ProfessionalAdvisoryResponse:
    """
    Handler function for professional advice endpoint
    This will be called by your FastAPI route
    """
    service = create_professional_advisory_service()
    return service.get_professional_advice(request)

def health_check() -> APIResponse:
    """Health check endpoint handler"""
    return APIResponse(
        success=True,
        message="Professional Advisory API is running",
        data={"status": "healthy", "service": "professional_advisory"}
    )

# Test/Demo function
def test_professional_advisory():
    """Test function to demonstrate the service"""
    # Sample data as it might come from React frontend
    sample_request = ProfessionalAdvisoryRequest(
        current_status="employed",
        career_goals="I want to transition into a senior management role in the tech industry within the next 2-3 years and eventually become a CTO.",
        skill_assessment={
            "Technical Skills": "Advanced",
            "Communication": "Intermediate",
            "Leadership": "Intermediate",
            "Problem Solving": "Advanced",
            "Project Management": "Intermediate",
            "Team Collaboration": "Advanced",
            "Time Management": "Intermediate",
            "Creativity": "Advanced"
        },
        experience_gaps="5-10 years",
        work_preferences="I prefer a collaborative work environment with opportunities for innovation and growth. I value work-life balance and flexible working arrangements.",
        learning_development="I want to develop my leadership and management skills, learn about business strategy, and stay updated with emerging technologies.",
        current_challenges=["Career Growth", "Leadership Opportunities", "Skill Gap"],
        target_applications="Tech companies like Google, Microsoft, startups in AI/ML space, and fintech companies"
    )

    # Test the service
    response = handle_professional_advice_request(sample_request)

    print("=== PROFESSIONAL CAREER ADVISORY RESPONSE ===")
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
    title="Professional Career Advisory API",
    description="AI-powered professional career guidance and advancement advisory service",
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
    return {"message": "Professional Career Advisory API is running", "status": "healthy"}

@app.get("/health")
async def health_check_endpoint():
    """Health check endpoint"""
    return health_check()

@app.post("/professional-advice", response_model=ProfessionalAdvisoryResponse)
async def get_professional_advice_endpoint(request: ProfessionalAdvisoryRequest):
    """
    Main endpoint to get professional career advice based on professional profile

    Args:
        request: ProfessionalAdvisoryRequest with professional details

    Returns:
        ProfessionalAdvisoryResponse: AI-generated professional career advice
    """
    try:
        response = handle_professional_advice_request(request)

        if not response.success:
            raise HTTPException(status_code=400, detail=response.error)

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/professional-advice/sample")
async def get_sample_request():
    """Get a sample request format for testing"""
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

if __name__ == "__main__":
    # For testing locally
    print("Starting Professional Career Advisory API server...")
    uvicorn.run("professional:app", host="0.0.0.0", port=8001, reload=True)
