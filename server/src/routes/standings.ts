import { Router } from 'express';
import { STANDINGS, TEAM_BATTING, TEAM_PITCHING } from '../data/standings';
import { scrapeStandings } from '../scrapers/kbo';
import { withCache } from '../cache';

const TTL = 10 * 60 * 1000; // 10분

const router = Router();

// GET /api/standings
router.get('/', async (_req, res) => {
  try {
    const data = await withCache('standings', TTL, scrapeStandings);
    res.json(data);
  } catch (e) {
    console.error('[standings] scrape failed, falling back to mock:', e);
    res.json(STANDINGS);
  }
});

// GET /api/standings/batting  (mock — 추후 스크래핑 추가)
router.get('/batting', (_req, res) => {
  res.json(TEAM_BATTING);
});

// GET /api/standings/pitching  (mock — 추후 스크래핑 추가)
router.get('/pitching', (_req, res) => {
  res.json(TEAM_PITCHING);
});

export default router;
