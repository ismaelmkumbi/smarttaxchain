#!/bin/bash

echo "🚀 Starting TRA Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Kill any existing processes on port 3000
echo "🔧 Checking for existing processes on port 3000..."
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "🛑 Killing existing processes on port 3000..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

# Start the mock backend server in the background
echo "🔧 Starting Mock TRA API Server on port 3000..."
node simple-server.js &
SERVER_PID=$!

# Wait a moment for the server to start
sleep 3

# Check if server started successfully
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Mock server is running at http://localhost:3000"
    echo "📊 Health check: http://localhost:3000/api/health"
else
    echo "❌ Failed to start mock server"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Start the frontend development server
echo "🌐 Starting Frontend Development Server..."
echo "🔗 Frontend will be available at http://localhost:5173"
echo "🔐 Login at http://localhost:5173/auth/login"
echo ""
echo "Press Ctrl+C to stop both servers"

# Start frontend
npm run dev

# Cleanup when frontend is stopped
echo ""
echo "🛑 Stopping mock server..."
kill $SERVER_PID 2>/dev/null
echo "✅ Development environment stopped" 