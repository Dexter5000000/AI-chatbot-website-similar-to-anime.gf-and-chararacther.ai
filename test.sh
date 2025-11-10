#!/bin/bash

# AI Chatbot Website - Test Script

echo "🧪 Testing AI Chatbot Website..."

# Test backend health
echo "🔧 Testing backend health..."
curl -s http://localhost:5000/health > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not responding"
    exit 1
fi

# Test frontend
echo "🎨 Testing frontend..."
curl -s http://localhost:3000 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is not responding"
    exit 1
fi

# Test MongoDB connection (if Docker)
if command -v docker-compose &> /dev/null; then
    echo "🗄️  Testing MongoDB connection..."
    docker-compose exec -T mongodb mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ MongoDB is connected"
    else
        echo "⚠️  MongoDB connection test failed"
    fi
fi

# Test Ollama (if Docker) - optional
# if command -v docker-compose &> /dev/null; then
#   echo "🤖 Testing Ollama..."
#   docker-compose exec -T ollama ollama list > /dev/null 2>&1
#   if [ $? -eq 0 ]; then
#     echo "✅ Ollama is running"
#   else
#     echo "⚠️  Ollama is not responding"
#   fi
# fi

echo ""
echo "🎉 Basic tests completed!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   API Health: http://localhost:5000/health"
echo ""
echo "👤 Demo credentials:"
echo "   Email: demo@example.com"
echo "   Password: password123"
echo ""