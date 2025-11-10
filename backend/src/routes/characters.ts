import express from 'express';
import { Character } from '../models/Character';
import { characterSchema } from '../middleware/validation';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all public characters
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const tags = req.query.tags as string;

    const query: any = { isPublic: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    const characters = await Character.find(query)
      .populate('createdBy', 'username')
      .sort({ messageCount: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Character.countDocuments(query);

    res.json({
      characters,
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

// Get character by ID
router.get('/:id', async (req, res, next) => {
  try {
    const character = await Character.findById(req.params.id)
      .populate('createdBy', 'username');

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Check if character is public or user is the creator
    if (!character.isPublic) {
      return res.status(403).json({ error: 'Character is private' });
    }

    res.json(character);
  } catch (error) {
    next(error);
  }
});

// Create new character
router.post('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { error, value } = characterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const character = new Character({
      ...value,
      createdBy: req.user._id
    });

    await character.save();
    await character.populate('createdBy', 'username');

    res.status(201).json(character);
  } catch (error) {
    next(error);
  }
});

// Update character
router.put('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { error, value } = characterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const character = await Character.findById(req.params.id);

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Check if user is the creator
    if (character.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this character' });
    }

    Object.assign(character, value);
    await character.save();
    await character.populate('createdBy', 'username');

    res.json(character);
  } catch (error) {
    next(error);
  }
});

// Delete character
router.delete('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const character = await Character.findById(req.params.id);

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Check if user is the creator
    if (character.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this character' });
    }

    await Character.findByIdAndDelete(req.params.id);

    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get user's characters
router.get('/user/my-characters', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const characters = await Character.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Character.countDocuments({ createdBy: req.user._id });

    res.json({
      characters,
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

export default router;