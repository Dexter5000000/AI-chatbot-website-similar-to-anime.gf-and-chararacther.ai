#!/bin/bash

# AI Chatbot Website - Quick Start Script

echo "🚀 Starting AI Chatbot Website Setup..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "✅ Backend .env file created. Please edit it with your configuration."
fi

# Start the services
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Pull Ollama model if using Ollama
echo "🤖 Pulling Mistral model for Ollama (this may take a few minutes)..."
docker-compose exec ollama ollama pull mistral 2>/dev/null || echo "⚠️  Ollama model pull failed. You can run 'docker-compose exec ollama ollama pull mistral' manually."

# Seed the database
echo "🌱 Seeding database with sample characters..."
docker-compose exec backend npm run seed 2>/dev/null || echo "⚠️  Database seeding failed. You can run 'docker-compose exec backend npm run seed' manually."

echo ""
echo "🎉 AI Chatbot Website is ready!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🗄️  MongoDB: localhost:27017"
echo "🤖 Ollama: http://localhost:11434"
echo ""
echo "📚 Demo user: demo@example.com / password123"
echo ""
echo "🛑 To stop: docker-compose down"
echo "📖 Logs: docker-compose logs -f [service-name]"
echo ""