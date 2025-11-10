import { Server, Socket } from 'socket.io';
import { Message } from '../models/Message';
import { Character } from '../models/Character';
import { llmService } from './llmService';

export const chatHandler = (socket: Socket, io: Server) => {
  const userId = socket.data.user.userId;

  // Join user's personal room
  socket.join(`user:${userId}`);

  // Handle joining a character chat room
  socket.on('join-character', async (characterId: string) => {
    try {
      // Verify character exists and is accessible
      const character = await Character.findById(characterId);
      if (!character) {
        socket.emit('error', { message: 'Character not found' });
        return;
      }

      if (!character.isPublic && character.createdBy.toString() !== userId) {
        socket.emit('error', { message: 'Character is private' });
        return;
      }

      // Join character room
      socket.join(`character:${characterId}`);
      socket.emit('joined-character', { characterId });
    } catch (error) {
      socket.emit('error', { message: 'Failed to join character chat' });
    }
  });

  // Handle sending messages
  socket.on('send-message', async (data: { characterId: string; content: string }) => {
    try {
      const { characterId, content } = data;

      // Verify character exists and is accessible
      const character = await Character.findById(characterId);
      if (!character) {
        socket.emit('error', { message: 'Character not found' });
        return;
      }

      if (!character.isPublic && character.createdBy.toString() !== userId) {
        socket.emit('error', { message: 'Character is private' });
        return;
      }

      // Save user message
      const userMessage = new Message({
        userId,
        characterId,
        content,
        role: 'user'
      });
      await userMessage.save();

      // Emit user message to sender
      socket.emit('message', {
        id: userMessage._id,
        characterId,
        content,
        role: 'user',
        timestamp: userMessage.timestamp
      });

      // Generate AI response
      try {
        const aiResponse = await llmService.generateResponse(characterId, userId, content);

        // Save AI response
        const assistantMessage = new Message({
          userId,
          characterId,
          content: aiResponse,
          role: 'assistant'
        });
        await assistantMessage.save();

        // Emit AI response to sender
        socket.emit('message', {
          id: assistantMessage._id,
          characterId,
          content: aiResponse,
          role: 'assistant',
          timestamp: assistantMessage.timestamp
        });

        // Update character message count
        await Character.findByIdAndUpdate(characterId, {
          $inc: { messageCount: 1 }
        });

      } catch (aiError) {
        console.error('AI Response Error:', aiError);
        socket.emit('error', { message: 'Failed to generate AI response' });
        
        // Send fallback message
        const fallbackMessage = new Message({
          userId,
          characterId,
          content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
          role: 'assistant'
        });
        await fallbackMessage.save();

        socket.emit('message', {
          id: fallbackMessage._id,
          characterId,
          content: fallbackMessage.content,
          role: 'assistant',
          timestamp: fallbackMessage.timestamp
        });
      }

    } catch (error) {
      console.error('Chat Handler Error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing', (data: { characterId: string; isTyping: boolean }) => {
    socket.to(`character:${data.characterId}`).emit('user-typing', {
      userId,
      characterId: data.characterId,
      isTyping: data.isTyping
    });
  });

  // Handle leaving character chat
  socket.on('leave-character', (characterId: string) => {
    socket.leave(`character:${characterId}`);
    socket.emit('left-character', { characterId });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    // Leave all character rooms
    const rooms = Array.from(socket.rooms);
    rooms.forEach(room => {
      if (room.startsWith('character:')) {
        socket.leave(room);
      }
    });
  });
};