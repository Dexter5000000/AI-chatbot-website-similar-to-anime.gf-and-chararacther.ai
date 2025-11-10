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
- **Free AI Models**: Powered by a completely free built-in AI model with NSFW support

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

## Quick Start

### Option 1: Docker (Recommended)
```bash
# Clone and start everything
git clone <repository-url>
cd ai-chatbot-website
./start.sh
```

### Option 2: Local Development
```bash
# Setup for local development
git clone <repository-url>
cd ai-chatbot-website
./setup-dev.sh
npm run dev
```

### Option 3: Manual Setup
See detailed setup instructions below.

## Scripts

The project includes helpful scripts for easy setup and management:

- `./start.sh` - Quick Docker setup (starts all services)
- `./setup-dev.sh` - Local development setup
- `./test.sh` - Test if services are running correctly
- `npm run dev` - Start frontend and backend in development mode
- `cd backend && npm run seed` - Populate database with sample characters

## Troubleshooting

If you encounter issues, check the [Troubleshooting Guide](TROUBLESHOOTING.md) for common problems and solutions.

## AI Model Setup

### Option 1: FREE Local AI Model (Recommended - No API Keys!)
**🔥 COMPLETELY FREE - NO COSTS, NO RESTRICTIONS, NSFW ENABLED**

The free built-in AI model includes:
- ✅ No API keys required
- ✅ No monthly costs
- ✅ NSFW content support
- ✅ Adult themes and conversations
- ✅ Violence and explicit content
- ✅ Drug discussion
- ✅ Unrestricted conversations
- ✅ Fast local processing

Simply set `AI_SERVICE_PROVIDER=free` in your `.env` file and start using immediately!

### Option 2: Ollama (Local)
1. Install Ollama: https://ollama.ai/
2. Pull a model: `ollama pull mistral`
3. Set `AI_SERVICE_PROVIDER=ollama` in your `.env`

### Option 3: Groq (Fast free tier)
1. Sign up at https://groq.com/
2. Get free API key
3. Set environment variables:
   ```
   AI_SERVICE_PROVIDER=groq
   GROQ_API_KEY=your-key
   ```

### Option 4: Hugging Face
1. Sign up at https://huggingface.co/
2. Get API key
3. Set environment variables:
   ```
   AI_SERVICE_PROVIDER=huggingface
   HUGGINGFACE_API_KEY=your-key
   ```

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

## 🍑 FREE NSFW AI Model

The platform now includes a **completely unrestricted built-in AI model**:

### ✅ Features
- **ZERO COSTS** - No API keys, no monthly fees, no usage limits
- **NO RESTRICTIONS** - Complete freedom of conversation topics
- **NSFW ENABLED** - Supports sexual content, violence, drugs, adult themes
- **UNLIMITED USAGE** - No rate limits or usage quotas
- **LOCAL PROCESSING** - Fast responses without external dependencies
- **CONTEXT AWARE** - Maintains conversation history and context
- **PERSONALITY ADAPTIVE** - Responds based on character traits

### 🎭 NSFW Characters Included
- **Siren** - Seductive enchantress exploring human desires
- **Raven** - Dark gothic character embracing taboo subjects

### 🚀 Usage
Simply set `AI_SERVICE_PROVIDER=free` in your `.env` file and start using immediately!

### 📖 Details
See [FREE_NSFW_AI.md](FREE_NSFW_AI.md) for complete documentation.

## License

MIT License - feel free to use this project for your own purposes!