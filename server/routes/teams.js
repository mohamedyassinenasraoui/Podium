import express from 'express';
import Team from '../models/Team.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper function to emit updates via Socket.IO
const emitTeamUpdate = (req) => {
  const io = req.app.get('io');
  if (io) {
    io.emit('teams:updated');
    io.emit('leaderboard:updated');
  }
};

// GET all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().sort({ points: -1, name: 1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single team
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create team (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const team = new Team(req.body);
    await team.save();
    emitTeamUpdate(req);
    res.status(201).json(team);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Une équipe avec ce nom existe déjà' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// PUT update team (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!team) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }
    emitTeamUpdate(req);
    res.json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH update team points (admin only)
router.patch('/:id/points', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { points, operation } = req.body; // operation: 'set', 'add', 'subtract'
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }

    if (operation === 'add') {
      team.points += points || 0;
    } else if (operation === 'subtract') {
      team.points = Math.max(0, team.points - (points || 0));
    } else {
      team.points = points || 0;
    }

    await team.save();
    emitTeamUpdate(req);
    res.json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE team (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }
    emitTeamUpdate(req);
    res.json({ message: 'Équipe supprimée avec succès', team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;



