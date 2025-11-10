# AI Chatbot Website

A modern AI chatbot platform similar to Character.ai where users can create and interact with unique AI characters.

## Features

- **Multiple AI Characters**: Create and chat with diverse AI personalities
- **Real-time Chat**: Live messaging with Socket.io
- **Character Creation**: Design custom AI characters with unique personalities
- **JWT Authentication**: Secure user authentication system
- **Responsive Design**: Beautiful mobile-friendly interface
- **Dark/Light Mode**: Toggle between themes
- **Message History**: Persistent chat conversations
- **Free AI Models**: Powered by Hugging Face, Groq, or Ollama

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Socket.io-client for real-time chat
- React Router for navigation
- React Hook Form for forms

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Multiple AI providers (Hugging Face, Groq, Ollama)

## Getting Started

### Prerequisites
- Node.js 16+
- MongoDB (local or cloud)
- Optional: Ollama for local AI models

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-chatbot-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-chatbot
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
NODE_ENV=development

# Choose AI provider: 'huggingface', 'groq', or 'ollama'
AI_SERVICE_PROVIDER=ollama

# For Hugging Face
HUGGINGFACE_API_KEY=your-huggingface-api-key

# For Groq
GROQ_API_KEY=your-groq-api-key

# For Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

4. Start the development servers:
```bash
npm run dev
```

This will start both the frontend (http://localhost:3000) and backend (http://localhost:5000).

## AI Model Setup

### Option 1: Ollama (Recommended for local development)
1. Install Ollama: https://ollama.ai/
2. Pull a model: `ollama pull mistral`
3. Set `AI_SERVICE_PROVIDER=ollama` in your `.env`

### Option 2: Hugging Face
1. Get a free API key from Hugging Face
2. Set `AI_SERVICE_PROVIDER=huggingface` and add your API key

### Option 3: Groq
1. Get a free API key from Groq
2. Set `AI_SERVICE_PROVIDER=groq` and add your API key

## Project Structure

```
ai-chatbot-website/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── types/          # TypeScript types
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   └── server.ts       # Server entry point
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Characters
- `GET /api/characters` - Get public characters
- `GET /api/characters/:id` - Get character by ID
- `POST /api/characters` - Create character (auth required)
- `PUT /api/characters/:id` - Update character (auth required)
- `DELETE /api/characters/:id` - Delete character (auth required)

### Chat
- `GET /api/chat/history/:characterId` - Get chat history (auth required)
- `POST /api/chat/send/:characterId` - Send message (auth required)
- `DELETE /api/chat/history/:characterId` - Clear history (auth required)

## Socket.io Events

### Client to Server
- `join-character` - Join a character chat room
- `send-message` - Send a message
- `typing` - Toggle typing indicator
- `leave-character` - Leave character chat room

### Server to Client
- `message` - Receive a new message
- `user-typing` - User typing indicator
- `error` - Error message

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/build`

### Backend (Railway/Render)
1. Deploy the backend folder
2. Set environment variables
3. Ensure MongoDB is accessible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes!