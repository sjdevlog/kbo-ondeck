export const STANDINGS = [
  { rank: 1,  name: '삼성 라이온즈', games: 51, win: 31, lose: 19, draw: 1, rate: 0.620, gb: null,  last10: '7승3패',    streak: '3연승' },
  { rank: 2,  name: 'SSG 랜더스',   games: 51, win: 30, lose: 20, draw: 1, rate: 0.600, gb: 1.0,   last10: '6승4패',    streak: '2연승' },
  { rank: 3,  name: 'KIA 타이거즈',  games: 50, win: 29, lose: 20, draw: 1, rate: 0.592, gb: 1.5,   last10: '4승1무5패', streak: '4연패' },
  { rank: 4,  name: '두산 베어스',   games: 53, win: 30, lose: 21, draw: 2, rate: 0.588, gb: 1.5,   last10: '6승2무2패', streak: '5연승' },
  { rank: 5,  name: '롯데 자이언츠', games: 51, win: 27, lose: 21, draw: 1, rate: 0.563, gb: 3.5,   last10: '6승1무3패', streak: '3연승' },
  { rank: 6,  name: 'NC 다이노스',   games: 50, win: 27, lose: 22, draw: 1, rate: 0.551, gb: 4.0,   last10: '4승1무5패', streak: '2연패' },
  { rank: 7,  name: 'LG 트윈스',    games: 52, win: 27, lose: 23, draw: 2, rate: 0.540, gb: 4.5,   last10: '5승5패',    streak: '2연승' },
  { rank: 8,  name: 'KT 위즈',      games: 51, win: 22, lose: 28, draw: 1, rate: 0.440, gb: 9.5,   last10: '5승5패',    streak: '2연승' },
  { rank: 9,  name: '한화 이글스',   games: 50, win: 20, lose: 29, draw: 1, rate: 0.408, gb: 11.0,  last10: '4승1무5패', streak: '1연승' },
  { rank: 10, name: '키움 히어로즈', games: 49, win: 18, lose: 29, draw: 0, rate: 0.383, gb: 12.5,  last10: '4승6패',    streak: '1연패' },
];

export const TEAM_BATTING = [
  { team: '삼성 라이온즈', avg: 0.281, obp: 0.360, slg: 0.435, ops: 0.795, hr: 74,  rbi: 248, r: 248, sb: 52 },
  { team: 'SSG 랜더스',   avg: 0.271, obp: 0.348, slg: 0.427, ops: 0.775, hr: 71,  rbi: 232, r: 232, sb: 38 },
  { team: 'KIA 타이거즈',  avg: 0.286, obp: 0.362, slg: 0.440, ops: 0.802, hr: 67,  rbi: 245, r: 245, sb: 61 },
  { team: '두산 베어스',   avg: 0.268, obp: 0.343, slg: 0.419, ops: 0.762, hr: 62,  rbi: 220, r: 220, sb: 44 },
  { team: '롯데 자이언츠', avg: 0.263, obp: 0.336, slg: 0.412, ops: 0.748, hr: 52,  rbi: 212, r: 212, sb: 57 },
  { team: 'NC 다이노스',   avg: 0.265, obp: 0.338, slg: 0.413, ops: 0.751, hr: 55,  rbi: 218, r: 218, sb: 42 },
  { team: 'LG 트윈스',    avg: 0.272, obp: 0.349, slg: 0.424, ops: 0.773, hr: 58,  rbi: 228, r: 228, sb: 49 },
  { team: 'KT 위즈',      avg: 0.258, obp: 0.330, slg: 0.405, ops: 0.735, hr: 48,  rbi: 205, r: 205, sb: 35 },
  { team: '한화 이글스',   avg: 0.270, obp: 0.345, slg: 0.425, ops: 0.770, hr: 68,  rbi: 235, r: 235, sb: 40 },
  { team: '키움 히어로즈', avg: 0.260, obp: 0.332, slg: 0.407, ops: 0.739, hr: 50,  rbi: 208, r: 208, sb: 66 },
];

export const TEAM_PITCHING = [
  { team: '삼성 라이온즈', era: 3.41, whip: 1.21, qs: 18, sv: 14, hld: 31, k: 412, bb: 158 },
  { team: 'SSG 랜더스',   era: 3.62, whip: 1.25, qs: 16, sv: 12, hld: 28, k: 388, bb: 162 },
  { team: 'KIA 타이거즈',  era: 3.78, whip: 1.28, qs: 14, sv: 13, hld: 26, k: 374, bb: 170 },
  { team: '두산 베어스',   era: 3.55, whip: 1.23, qs: 17, sv: 11, hld: 29, k: 395, bb: 155 },
  { team: '롯데 자이언츠', era: 3.90, whip: 1.30, qs: 13, sv: 10, hld: 24, k: 361, bb: 178 },
  { team: 'NC 다이노스',   era: 3.85, whip: 1.29, qs: 14, sv: 9,  hld: 25, k: 368, bb: 172 },
  { team: 'LG 트윈스',    era: 3.70, whip: 1.26, qs: 15, sv: 11, hld: 27, k: 381, bb: 165 },
  { team: 'KT 위즈',      era: 4.21, whip: 1.38, qs: 10, sv: 8,  hld: 20, k: 342, bb: 192 },
  { team: '한화 이글스',   era: 4.05, whip: 1.33, qs: 12, sv: 10, hld: 22, k: 355, bb: 182 },
  { team: '키움 히어로즈', era: 4.38, whip: 1.40, qs: 9,  sv: 7,  hld: 18, k: 331, bb: 198 },
];
