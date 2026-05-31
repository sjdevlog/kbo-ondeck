import { Router } from 'express';
import { getGamesForDate } from '../data/schedule';

const router = Router();

// GET /api/schedule/:date  (date: YYYY-MM-DD)
router.get('/:date', (req, res) => {
  const { date } = req.params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: 'date must be YYYY-MM-DD' });
    return;
  }
  res.json({ date, games: getGamesForDate(date) });
});

export default router;
