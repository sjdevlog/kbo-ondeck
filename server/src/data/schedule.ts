export type CancelReason = '우천' | '강풍' | '폭염' | '미세먼지' | '황사';

export type Game = {
  away: string;
  home: string;
  time: string;
  stadium: string;
  broadcast: string;
  cancelled?: CancelReason;
  doubleheader?: 1 | 2;
};

const WEEKDAY: Game[] = [
  { away: 'KIA 타이거즈',  home: 'LG 트윈스',     time: '18:30', stadium: '잠실',                  broadcast: 'KBS N 스포츠' },
  { away: '두산 베어스',   home: 'SSG 랜더스',    time: '18:30', stadium: '인천SSG랜더스필드',     broadcast: '스포티비' },
  { away: '삼성 라이온즈', home: 'NC 다이노스',   time: '18:30', stadium: '창원NC파크',            broadcast: 'MBC스포츠+', cancelled: '우천' },
  { away: '한화 이글스',  home: '롯데 자이언츠',  time: '18:30', stadium: '사직',                  broadcast: '스포티비2', cancelled: '미세먼지' },
  { away: '키움 히어로즈', home: 'KT 위즈',       time: '18:30', stadium: '수원KT위즈파크',        broadcast: 'TVING' },
];

const SATURDAY: Game[] = [
  { away: 'SSG 랜더스',   home: 'LG 트윈스',     time: '17:00', stadium: '잠실',                  broadcast: '스포티비', cancelled: '강풍' },
  { away: 'NC 다이노스',  home: '삼성 라이온즈',  time: '17:00', stadium: '대구삼성라이온즈파크',  broadcast: 'MBC스포츠+' },
  { away: '롯데 자이언츠', home: '한화 이글스',   time: '17:00', stadium: '대전한화생명볼파크',    broadcast: '스포티비2', cancelled: '폭염' },
  { away: 'KT 위즈',      home: '키움 히어로즈',  time: '17:00', stadium: '고척스카이돔',          broadcast: 'TVING', cancelled: '황사' },
  { away: '두산 베어스',   home: 'KIA 타이거즈',  time: '17:00', stadium: '광주기아챔피언스필드',  broadcast: 'KBS N 스포츠' },
];

const SUNDAY: Game[] = [
  { away: '두산 베어스',   home: 'KIA 타이거즈',  time: '14:00', stadium: '광주기아챔피언스필드',  broadcast: 'KBS N 스포츠', doubleheader: 1 },
  { away: '두산 베어스',   home: 'KIA 타이거즈',  time: '18:00', stadium: '광주기아챔피언스필드',  broadcast: 'KBS N 스포츠', doubleheader: 2 },
  { away: 'SSG 랜더스',   home: 'LG 트윈스',     time: '14:00', stadium: '잠실',                  broadcast: '스포티비' },
  { away: 'NC 다이노스',  home: '삼성 라이온즈',  time: '14:00', stadium: '대구삼성라이온즈파크',  broadcast: 'MBC스포츠+' },
  { away: '롯데 자이언츠', home: '한화 이글스',   time: '14:00', stadium: '대전한화생명볼파크',    broadcast: '스포티비2' },
  { away: 'KT 위즈',      home: '키움 히어로즈',  time: '14:00', stadium: '고척스카이돔',          broadcast: 'TVING' },
];

export function getGamesForDate(isoDate: string): Game[] {
  const date = new Date(isoDate + 'T00:00:00');
  const dow = date.getDay();
  if (dow === 1) return [];
  if (dow >= 2 && dow <= 5) return WEEKDAY;
  if (dow === 6) return SATURDAY;
  return SUNDAY;
}
