# Troubleshooting Guide

This guide covers common issues and their solutions for the AI Chatbot Website.

## Quick Start Issues

### Docker Setup
```bash
# If start.sh fails, try these steps:
chmod +x start.sh
./start.sh

# Check Docker status:
docker-compose ps

# View logs:
docker-compose logs -f [service-name]
```

### Local Development
```bash
# Run setup script:
chmod +x setup-dev.sh
./setup-dev.sh

# Start servers:
npm run dev
```

## Common Problems

### 1. Port Already in Use
**Error:** `Error: listen EADDRINUSE :::3000` or `:::5000`

**Solutions:**
```bash
# Find process using port
lsof -i :3000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change ports in docker-compose.yml or .env
```

### 2. MongoDB Connection Failed
**Error:** `MongoNetworkError: failed to connect to server`

**Solutions:**
```bash
# Check if MongoDB is running
docker-compose ps
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb

# For local MongoDB, ensure it's running:
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 3. AI Model Not Responding
**Error:** `Failed to generate response` or timeout

**Solutions:**
```bash
# For Ollama, check if model is pulled:
docker-compose exec ollama ollama list

# Pull model:
docker-compose exec ollama ollama pull mistral

# Check Ollama logs:
docker-compose logs ollama

# For Groq/Hugging Face, verify API keys:
# Check backend/.env for correct API keys
```

### 4. Frontend Build Fails
**Error:** `Module not found` or build errors

**Solutions:**
```bash
# Clear node_modules and reinstall:
cd frontend
rm -rf node_modules package-lock.json
npm install

# Check for missing dependencies:
npm ls

# Rebuild:
npm run build
```

### 5. Backend TypeScript Errors
**Error:** TypeScript compilation errors

**Solutions:**
```bash
# Check TypeScript version:
npx tsc --version

# Clean build:
cd backend
rm -rf dist
npm run build

# Install missing types:
npm install --save-dev @types/[package-name]
```

### 6. Socket.io Connection Issues
**Error:** `WebSocket connection failed`

**Solutions:**
```bash
# Check CORS settings in backend/src/server.ts
# Ensure frontend URL is in CORS origin

# Verify backend is running:
curl http://localhost:5000/health

# Check firewall settings
# Ensure ports 3000 and 5000 are open
```

### 7. Authentication Issues
**Error:** `Invalid token` or `Access token required`

**Solutions:**
```bash
# Check JWT_SECRET in backend/.env
# Ensure it's not empty or default

# Clear browser localStorage:
# Open browser dev tools -> Application -> Local Storage
# Clear all data for localhost:3000

# Check token expiration:
# Verify JWT_EXPIRE in backend/.env
```

### 8. Docker Volume Issues
**Error:** Permission denied or data loss

**Solutions:**
```bash
# Reset Docker volumes:
docker-compose down -v
docker-compose up -d

# Check volume permissions:
ls -la /var/lib/docker/volumes/

# Re-seed database:
docker-compose exec backend npm run seed
```

## Debugging Commands

### Backend Debugging
```bash
# Check backend logs:
docker-compose logs -f backend

# Access backend container:
docker-compose exec backend sh

# Test API endpoints:
curl -X GET http://localhost:5000/health
curl -X GET http://localhost:5000/api/characters

# Check environment variables:
docker-compose exec backend env | grep -E "(MONGO|JWT|AI)"
```

### Frontend Debugging
```bash
# Check frontend logs:
docker-compose logs -f frontend

# Access frontend container:
docker-compose exec frontend sh

# Test frontend directly:
curl -I http://localhost:3000

# Check build:
docker-compose exec frontend ls -la /usr/share/nginx/html
```

### Database Debugging
```bash
# Access MongoDB:
docker-compose exec mongodb mongosh

# List databases:
show dbs

# Check collections:
use ai-chatbot
show collections

# Query users:
db.users.find().pretty()

# Query characters:
db.characters.find().pretty()
```

## Performance Issues

### Slow AI Responses
1. **Ollama**: Ensure sufficient RAM (8GB+ recommended)
2. **Groq**: Check rate limits and API quota
3. **Hugging Face**: Consider using smaller models

### Database Slowness
```bash
# Check MongoDB indexes:
docker-compose exec mongodb mongosh --eval "db.characters.getIndexes()"

# Create missing indexes:
docker-compose exec backend npm run db-index
```

### Memory Issues
```bash
# Monitor Docker resource usage:
docker stats

# Increase Docker memory limits:
# In Docker Desktop settings, increase RAM allocation
```

## Environment-Specific Issues

### macOS
```bash
# Docker permission issues:
sudo chown -R $USER /usr/local/bin/docker*

# Port binding issues:
# Use ports > 1024 or run with sudo
```

### Windows
```bash
# WSL2 issues:
# Ensure WSL2 is properly configured
# Check .wslconfig for memory limits

# Path issues:
# Use Git Bash instead of Command Prompt
# Or use Windows Terminal
```

### Linux
```bash
# Permission issues:
sudo usermod -aG docker $USER
# Log out and log back in

# Firewall issues:
sudo ufw allow 3000
sudo ufw allow 5000
sudo ufw allow 27017
```

## Getting Help

### Check Logs Always
```bash
# All services:
docker-compose logs

# Specific service:
docker-compose logs -f [service-name]

# Real-time logs:
docker-compose logs -f --tail=100
```

### Reset Everything
```bash
# Complete reset (WARNING: deletes all data):
docker-compose down -v
docker system prune -a
./start.sh
```

### Common Fixes
1. **Restart services**: `docker-compose restart`
2. **Rebuild images**: `docker-compose build --no-cache`
3. **Clear browser cache**: Hard refresh (Ctrl+Shift+R)
4. **Check environment variables**: Verify `.env` files
5. **Update dependencies**: `npm update`

### Still Having Issues?
1. Check the [Deployment Guide](DEPLOYMENT.md)
2. Review the [README.md](README.md)
3. Create an issue with:
   - Operating system
   - Docker version
   - Error messages
   - Steps to reproduce
   - `docker-compose logs` output