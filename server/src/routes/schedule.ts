import { Router } from 'express';
import { getGamesForDate } from '../data/schedule';
import { scrapeNextSchedule } from '../scrapers/kbo';
import { withCache } from '../cache';

const router = Router();

const TTL = 10 * 60 * 1000; // 10분

async function getSchedule(date: string): Promise<object[]> {
  try {
    const result = await withCache('next-schedule', TTL, scrapeNextSchedule);
    if (result.date === date && result.games.length > 0) return result.games;
  } catch (e) {
    console.error('[schedule] scrape failed:', e);
  }
  return getGamesForDate(date);
}

// GET /api/schedule/:date  (date: YYYY-MM-DD)
router.get('/:date', async (req, res) => {
  const { date } = req.params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: 'date must be YYYY-MM-DD' });
    return;
  }
  const games = await getSchedule(date);
  res.json({ date, games });
});

export default router;
