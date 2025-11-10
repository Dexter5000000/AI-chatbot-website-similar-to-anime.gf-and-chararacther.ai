import express from 'express';
import { Message } from '../models/Message';
import { Character } from '../models/Character';
import { messageSchema } from '../middleware/validation';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get chat history for a character
router.get('/history/:characterId', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { characterId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    // Verify character exists and is accessible
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    if (!character.isPublic && character.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Character is private' });
    }

    const messages = await Message.find({
      userId: req.user._id,
      characterId
    })
      .sort({ timestamp: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({
      userId: req.user._id,
      characterId
    });

    res.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Send a message (non-real-time endpoint)
router.post('/send/:characterId', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { characterId } = req.params;
    const { error, value } = messageSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Verify character exists and is accessible
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    if (!character.isPublic && character.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Character is private' });
    }

    // Save user message
    const userMessage = new Message({
      userId: req.user._id,
      characterId,
      content: value.content,
      role: 'user'
    });
    await userMessage.save();

    // Generate AI response (this would be handled by the AI service)
    // For now, return a placeholder
    const aiResponse = new Message({
      userId: req.user._id,
      characterId,
      content: "This is a placeholder response. Real-time chat will handle AI responses.",
      role: 'assistant'
    });
    await aiResponse.save();

    // Update character message count
    await Character.findByIdAndUpdate(characterId, {
      $inc: { messageCount: 1 }
    });

    res.json({
      userMessage,
      aiResponse
    });
  } catch (error) {
    next(error);
  }
});

// Delete chat history
router.delete('/history/:characterId', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { characterId } = req.params;

    // Verify character exists
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Delete all messages between user and character
    await Message.deleteMany({
      userId: req.user._id,
      characterId
    });

    res.json({ message: 'Chat history deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;