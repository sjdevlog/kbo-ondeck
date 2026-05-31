import type { Game } from '@/app/(tabs)/games';

// 개발: localhost, 배포 후 실서버 주소로 교체
const BASE_URL = 'http://localhost:3000';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  schedule: (isoDate: string) =>
    get<{ date: string; games: Game[] }>(`/api/schedule/${isoDate}`)
      .then((d) => d.games),

  standings: () => get<unknown[]>('/api/standings'),

  teamBatting: () => get<unknown[]>('/api/standings/batting'),

  teamPitching: () => get<unknown[]>('/api/standings/pitching'),
};
