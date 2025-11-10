# Deployment Guide

This guide covers various deployment options for the AI Chatbot Website.

## Quick Start with Docker (Recommended)

The easiest way to deploy the entire application is using Docker Compose:

1. **Clone and setup:**
```bash
git clone <repository-url>
cd ai-chatbot-website
```

2. **Start all services:**
```bash
docker-compose up -d
```

This will start:
- Frontend on http://localhost:3000
- Backend API on http://localhost:5000
- MongoDB on port 27017
- Ollama (optional) on port 11434

3. **Pull an AI model for Ollama:**
```bash
docker-compose exec ollama ollama pull mistral
```

4. **Seed the database:**
```bash
docker-compose exec backend npm run seed
```

## Manual Deployment

### Backend Deployment

#### Option 1: Railway
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard:
   ```
   PORT=5000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   AI_SERVICE_PROVIDER=free (recommended - no costs)
   # GROQ_API_KEY=your-groq-key (if using Groq)
   ```
3. Deploy the `backend` folder

#### Option 2: Render
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Add environment variables
5. Deploy

#### Option 3: DigitalOcean App Platform
1. Create a new app
2. Connect repository
3. Set source directory to `backend`
4. Add environment variables
5. Deploy

### Frontend Deployment

#### Option 1: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/build`
4. Add environment variable: `REACT_APP_SERVER_URL=https://your-backend-url.com`
5. Deploy

#### Option 2: Netlify
1. Connect repository to Netlify
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/build`
4. Add redirect rule for SPA routing
5. Deploy

#### Option 3: Cloudflare Pages
1. Connect repository
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/build`
4. Deploy

## Database Setup

### MongoDB Atlas (Cloud)
1. Create a free cluster at https://www.mongodb.com/atlas
2. Get connection string
3. Add to environment variables: `MONGODB_URI=mongodb+srv://...`

### Self-hosted MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7

# Or install locally
sudo apt-get install mongodb
```

## AI Model Setup

### Option 1: Groq (Recommended for production)
1. Sign up at https://groq.com/
2. Get free API key
3. Set environment variables:
   ```
   AI_SERVICE_PROVIDER=groq
   GROQ_API_KEY=your-key
   GROQ_MODEL=mixtral-8x7b-32768
   ```

### Option 2: Hugging Face
1. Sign up at https://huggingface.co/
2. Get API key
3. Set environment variables:
   ```
   AI_SERVICE_PROVIDER=huggingface
   HUGGINGFACE_API_KEY=your-key
   HUGGINGFACE_MODEL=meta-llama/Llama-2-7b-chat-hf
   ```

### Option 3: Ollama (Self-hosted)
1. Deploy Ollama server
2. Pull a model: `ollama pull mistral`
3. Set environment variables:
   ```
   AI_SERVICE_PROVIDER=ollama
   OLLAMA_BASE_URL=http://your-ollama-server:11434
   OLLAMA_MODEL=mistral
   ```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-chatbot
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=production

# AI Provider (choose one)
AI_SERVICE_PROVIDER=groq
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=mixtral-8x7b-32768

# Or Hugging Face
# AI_SERVICE_PROVIDER=huggingface
# HUGGINGFACE_API_KEY=your-huggingface-api-key
# HUGGINGFACE_MODEL=meta-llama/Llama-2-7b-chat-hf

# Or Ollama
# AI_SERVICE_PROVIDER=ollama
# OLLAMA_BASE_URL=http://localhost:11434
# OLLAMA_MODEL=mistral
```

### Frontend (.env)
```env
REACT_APP_SERVER_URL=https://your-backend-domain.com
```

## SSL/HTTPS Setup

### Backend (Express)
Use a reverse proxy like Nginx or Caddy for SSL termination.

### Frontend
Most hosting providers (Vercel, Netlify) handle SSL automatically.

## Monitoring and Logs

### Backend Monitoring
- Use services like Sentry for error tracking
- Set up logging with Winston or similar
- Monitor with services like LogRocket

### Frontend Monitoring
- Use Vercel Analytics (if on Vercel)
- Set up error tracking with Sentry
- Use browser dev tools for performance

## Scaling Considerations

### Backend
- Use Redis for session storage
- Implement rate limiting
- Consider serverless functions for AI requests
- Use CDN for static assets

### Database
- Index frequently queried fields
- Consider read replicas for high traffic
- Implement caching strategies

### Frontend
- Implement code splitting
- Use lazy loading for components
- Optimize images and assets
- Consider CDN for static files

## Security Best Practices

1. **Environment Variables**: Never commit secrets to Git
2. **Input Validation**: Sanitize all user inputs
3. **Rate Limiting**: Implement on API endpoints
4. **CORS**: Configure properly for your domain
5. **JWT**: Use secure secrets and proper expiration
6. **HTTPS**: Always use SSL in production
7. **Database**: Use authentication and encryption
8. **Dependencies**: Keep packages updated

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check backend CORS configuration
2. **Database Connection**: Verify MongoDB URI and network access
3. **AI API Errors**: Check API keys and model availability
4. **Socket.io Issues**: Ensure proper authentication
5. **Build Failures**: Check Node.js version compatibility

### Debug Commands

```bash
# Check backend logs
docker-compose logs backend

# Check database connection
docker-compose exec backend npm run test

# Test API endpoints
curl http://localhost:5000/health

# Check AI service
curl -X POST http://localhost:5000/api/test-ai
```

## Performance Optimization

1. **Frontend**: Implement lazy loading, code splitting
2. **Backend**: Use caching, optimize database queries
3. **AI Requests**: Implement request queuing, caching
4. **Database**: Add proper indexes, use connection pooling
5. **Network**: Use CDN, implement compression

## Backup Strategy

1. **Database**: Regular MongoDB backups
2. **Code**: Git version control
3. **Environment**: Store configs securely
4. **User Data**: Export options for users

## Support

For deployment issues:
1. Check logs: `docker-compose logs [service]`
2. Verify environment variables
3. Test API endpoints manually
4. Check network connectivity
5. Review security configurations