import axios from 'axios';
import * as cheerio from 'cheerio';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Referer: 'https://statiz.co.kr',
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

    rows.push({
      rank:   parseInt($(tds[0]).text().trim()) || 0,
      name:   fullName,
      games:  parseInt($(tds[2]).text().trim()) || 0,
      win:    parseInt($(tds[3]).text().trim()) || 0,
      draw:   parseInt($(tds[4]).text().trim()) || 0,
      lose:   parseInt($(tds[5]).text().trim()) || 0,
      gb:     gb === '0.0' ? null : parseFloat(gb) || null,
      rate:   parseFloat($(tds[7]).text().trim()) || 0,
      r:      parseInt($(tds[8]).text().trim()) || 0,
    });
  });

  return rows.filter((r: any) => r.name && r.games > 0);
}
