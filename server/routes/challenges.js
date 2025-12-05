import express from 'express';
import Challenge from '../models/Challenge.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper function to emit updates via Socket.IO
const emitChallengeUpdate = (req) => {
  const io = req.app.get('io');
  if (io) {
    io.emit('challenges:updated');
  }
};

// GET all challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single challenge
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Défi non trouvé' });
    }
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create challenge (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const challenge = new Challenge(req.body);
    await challenge.save();
    emitChallengeUpdate(req);
    res.status(201).json(challenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update challenge (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!challenge) {
      return res.status(404).json({ error: 'Défi non trouvé' });
    }
    emitChallengeUpdate(req);
    res.json(challenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE challenge (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Défi non trouvé' });
    }
    emitChallengeUpdate(req);
    res.json({ message: 'Défi supprimé avec succès', challenge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;



