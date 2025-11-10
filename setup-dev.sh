#!/bin/bash

# AI Chatbot Website - Local Development Setup Script

echo "🛠️  Setting up AI Chatbot Website for local development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH."
    echo "   Please install MongoDB or use Docker: docker run -d -p 27017:27017 mongo:7"
    echo "   Or use MongoDB Atlas: https://www.mongodb.com/atlas"
    echo ""
    read -p "Press Enter to continue anyway (you'll need to update MONGODB_URI in .env)..."
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Install backend dependencies
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cp .env.example .env
    echo "✅ Backend .env file created. Please edit it with your configuration."
fi

cd ..

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend

# Install frontend dependencies
npm install

# Create .env file for frontend if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating frontend .env.local file..."
    cat > .env.local << EOF
REACT_APP_SERVER_URL=http://localhost:5000
EOF
    echo "✅ Frontend .env.local file created."
fi

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your configuration"
echo "2. Make sure MongoDB is running"
echo "3. Start the development servers:"
echo "   npm run dev"
echo ""
echo "🤖 Don't forget to set up your AI provider in backend/.env:"
echo "   - For Ollama: Install Ollama and run 'ollama pull mistral'"
echo "   - For Groq: Get API key from https://groq.com/"
echo "   - For Hugging Face: Get API key from https://huggingface.co/"
echo ""