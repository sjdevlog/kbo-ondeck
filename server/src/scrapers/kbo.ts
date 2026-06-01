import axios from 'axios';
import * as cheerio from 'cheerio';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Referer: 'https://statiz.co.kr',
};

// 연속 기록 (순위 순서대로 수동 업데이트)
const STREAK_BY_RANK: Record<number, string> = {
  1: '3연승',
  2: '4연승',
  3: '1연승',
  4: '3연패',
  5: '4연승',
  6: '1연패',
  7: '2연승',
  8: '12연패',
  9: '2연패',
  10: '8연패',
};

// statiz 단축팀명 → KBO 풀네임 매핑
const TEAM_NAME_MAP: Record<string, string> = {
  'LG':   'LG 트윈스',
  'KT':   'KT 위즈',
  '삼성':  '삼성 라이온즈',
  'KIA':  'KIA 타이거즈',
  '한화':  '한화 이글스',
  '두산':  '두산 베어스',
  'NC':   'NC 다이노스',
  'SSG':  'SSG 랜더스',
  '롯데':  '롯데 자이언츠',
  '키움':  '키움 히어로즈',
};

// ─── 경기 일정 (statiz 메인 '다음 경기 일정' 섹션) ──────────────
export async function scrapeNextSchedule(): Promise<{ date: string; games: object[] }> {
  const { data } = await axios.get('https://statiz.co.kr', { headers: HEADERS });
  const $ = cheerio.load(data);

  let scheduleBox: cheerio.Cheerio<cheerio.Element> | null = null;
  $('.box_head').each((_, el) => {
    if ($(el).text().includes('다음 경기 일정')) {
      scheduleBox = $(el).parent() as cheerio.Cheerio<cheerio.Element>;
    }
  });
  if (!scheduleBox) return { date: '', games: [] };

  const date = (scheduleBox as cheerio.Cheerio<cheerio.Element>).find('.box_head .time').text().replace(/[()]/g, '').trim();
  const games: object[] = [];

  (scheduleBox as cheerio.Cheerio<cheerio.Element>).find('.g_schedule').each((_, el) => {
    const away    = $(el).find('p').first().text().trim();
    const home    = $(el).find('p').last().text().trim();
    const stadium = $(el).find('span a').first().text().trim();
    const time    = $(el).find('span.time').text().trim();
    if (!away || !home || !time) return;

    games.push({
      away:     TEAM_NAME_MAP[away]  ?? away,
      home:     TEAM_NAME_MAP[home]  ?? home,
      time,
      stadium,
      broadcast: '',
    });
  });

  return { date, games };
}

// ─── 팀 순위 (statiz 메인 페이지 table[2]) ────────────────────
export async function scrapeStandings() {
  const { data } = await axios.get('https://statiz.co.kr', { headers: HEADERS });
  const $ = cheerio.load(data);
  const rows: object[] = [];

  $('table').eq(2).find('tbody tr').each((_, tr) => {
    const tds = $(tr).find('td');
    if (tds.length < 9) return;

    const shortName = $(tds[1]).text().trim();
    const fullName = TEAM_NAME_MAP[shortName] ?? shortName;
    const gb = $(tds[6]).text().trim();

    const rank = parseInt($(tds[0]).text().trim()) || 0;
    rows.push({
      rank,
      name:   fullName,
      games:  parseInt($(tds[2]).text().trim()) || 0,
      win:    parseInt($(tds[3]).text().trim()) || 0,
      draw:   parseInt($(tds[4]).text().trim()) || 0,
      lose:   parseInt($(tds[5]).text().trim()) || 0,
      gb:     gb === '0.0' ? null : parseFloat(gb) || null,
      rate:   parseFloat($(tds[7]).text().trim()) || 0,
      r:      parseInt($(tds[8]).text().trim()) || 0,
      streak: STREAK_BY_RANK[rank] ?? '-',
    });
  });

  return rows.filter((r: any) => r.name && r.games > 0);
}
