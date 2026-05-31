import { Router } from 'express';
import { STANDINGS, TEAM_BATTING, TEAM_PITCHING } from '../data/standings';

const router = Router();

// GET /api/standings
router.get('/', (_req, res) => {
  res.json(STANDINGS);
});

// GET /api/standings/batting
router.get('/batting', (_req, res) => {
  res.json(TEAM_BATTING);
});

// GET /api/standings/pitching
router.get('/pitching', (_req, res) => {
  res.json(TEAM_PITCHING);
});

export default router;
