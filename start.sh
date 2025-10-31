#!/bin/bash

# AI Career Counsellor Startup Script
echo "🚀 Starting AI Career Counsellor Application..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Navigate to backend directory
cd backend

# Check if virtual environment exists, if not create one
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Start backend server in background
echo "🖥️  Starting backend server on port 8000..."
python main.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Navigate to frontend directory
cd ..

# Install Node.js dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📥 Installing Node.js dependencies..."
    npm install
fi

# Start frontend development server
echo "🌐 Starting frontend development server on port 5173..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Application started successfully!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped successfully!"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
