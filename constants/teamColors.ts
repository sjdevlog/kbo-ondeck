export type TeamColor = { primary: string; background: string; lightBg: string; short: string };

export const TEAM_COLORS: Record<string, TeamColor> = {
  'LG 트윈스':    { primary: '#C8102E', background: '#3a0a10', lightBg: '#fee2e2', short: 'LG' },
  '한화 이글스':  { primary: '#F06820', background: '#3a1a08', lightBg: '#ffedd5', short: '한화' },
  '삼성 라이온즈': { primary: '#2060B0', background: '#0a1e3a', lightBg: '#dbeafe', short: '삼성' },
  'SSG 랜더스':   { primary: '#9E1B32', background: '#2e080f', lightBg: '#ffe4e6', short: 'SSG' },
  'NC 다이노스':  { primary: '#1D3570', background: '#0a1228', lightBg: '#e0e7ff', short: 'NC' },
  'KT 위즈':     { primary: '#555555', background: '#1a1a1a', lightBg: '#f1f5f9', short: 'KT' },
  '롯데 자이언츠': { primary: '#1B2D70', background: '#0a1030', lightBg: '#e0e7ff', short: '롯데' },
  'KIA 타이거즈': { primary: '#CC1020', background: '#380810', lightBg: '#fee2e2', short: 'KIA' },
  '두산 베어스':  { primary: '#1B2D60', background: '#0a1028', lightBg: '#dbeafe', short: '두산' },
  '키움 히어로즈': { primary: '#8B1538', background: '#280810', lightBg: '#fce7f3', short: '키움' },
};
