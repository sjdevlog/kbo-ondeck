import { Router } from 'express';
import { getGamesForDate } from '../data/schedule';
import { scrapeNextSchedule } from '../scrapers/kbo';

const router = Router();

// 캐시: 같은 날 중복 스크래핑 방지
let cache: { date: string; games: object[] } | null = null;

async function getSchedule(date: string): Promise<object[]> {
  // 캐시 없거나 날짜 다르면 재스크래핑
  if (!cache || cache.date !== date) {
    try {
      const result = await scrapeNextSchedule();
      // statiz의 다음 경기 날짜와 요청 날짜가 일치하면 실데이터 반환
      if (result.date === date && result.games.length > 0) {
        cache = result;
        return result.games;
      }
    } catch (e) {
      console.error('[schedule] scrape failed:', e);
    }
    // 일치 안 하면 mock 데이터 fallback
    return getGamesForDate(date);
  }
  return cache.games;
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
