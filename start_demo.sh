#!/bin/bash

# Kill any existing processes on ports 3000 and 5328
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:5328 | xargs kill -9 2>/dev/null

# Start Backend
echo "🚀 Starting Flask Backend..."
cd backend
python3 app.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo "   Backend running (PID: $BACKEND_PID)"

# Wait for backend to be ready
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Start Frontend
echo "✨ Starting Next.js Frontend..."
cd frontend
# Use pnpm dev if available, otherwise npm
if command -v pnpm &> /dev/null; then
    pnpm run dev > ../frontend.log 2>&1 &
else
    npm run dev > ../frontend.log 2>&1 &
fi
FRONTEND_PID=$!
cd ..
echo "   Frontend running (PID: $FRONTEND_PID)"

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to be ready..."
sleep 5

# Open Browser
echo "🌍 Opening Demo Dashboard..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:3000/manager"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "http://localhost:3000/manager"
fi

echo "✅ Demo is LIVE!"
echo "   - Manager Dashboard: http://localhost:3000/manager"
echo "   - Citizen Map:       http://localhost:3000/citizen/map"
echo "   - Backend API:       http://localhost:5328"
echo ""
echo "Press CTRL+C to stop the demo."

# Trap SIGINT to kill background processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT

# Keep script running
wait
