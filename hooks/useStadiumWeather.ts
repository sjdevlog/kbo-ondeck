import { useEffect, useRef, useState } from 'react';

export type WeatherInfo = {
  tempMax: number;
  tempMin: number;
  code: number;
  icon: string;
  label: string;
};

const STADIUM_COORDS: Record<string, { lat: number; lon: number }> = {
  '잠실':              { lat: 37.5122, lon: 127.0719 },
  '광주기아챔피언스필드': { lat: 35.1681, lon: 126.8892 },
  '인천SSG랜더스필드':   { lat: 37.4370, lon: 126.6930 },
  '대구삼성라이온즈파크': { lat: 35.8412, lon: 128.6814 },
  '창원NC파크':         { lat: 35.2226, lon: 128.5822 },
  '사직':              { lat: 35.1941, lon: 129.0613 },
  '대전한화생명볼파크':  { lat: 36.3175, lon: 127.4297 },
  '수원KT위즈파크':     { lat: 37.2997, lon: 127.0097 },
  '고척스카이돔':       { lat: 37.4983, lon: 126.8676 },
};

function codeToWeather(code: number): { icon: string; label: string } {
  if (code === 0)           return { icon: '☀️',  label: '맑음'   };
  if (code <= 3)            return { icon: '⛅',  label: '구름'   };
  if (code <= 48)           return { icon: '🌫️', label: '안개'   };
  if (code <= 55)           return { icon: '🌦️', label: '이슬비' };
  if (code <= 65)           return { icon: '🌧️', label: '비'     };
  if (code <= 75)           return { icon: '❄️',  label: '눈'     };
  if (code <= 82)           return { icon: '🌩️', label: '소나기' };
  return                           { icon: '⛈️',  label: '뇌우'   };
}

// module-level cache: stadium -> { iso-date -> WeatherInfo }
const cache: Record<string, Record<string, WeatherInfo>> = {};

async function fetchWeeklyWeather(stadium: string): Promise<Record<string, WeatherInfo>> {
  if (cache[stadium]) return cache[stadium];

  const coords = STADIUM_COORDS[stadium];
  if (!coords) return {};

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${coords.lat}&longitude=${coords.lon}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=Asia%2FSeoul&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  const result: Record<string, WeatherInfo> = {};

  (data.daily.time as string[]).forEach((isoDate, i) => {
    const code = data.daily.weather_code[i] as number;
    result[isoDate] = {
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      code,
      ...codeToWeather(code),
    };
  });

  cache[stadium] = result;
  return result;
}

type WeatherState = {
  map: Record<string, Record<string, WeatherInfo>>;
  loading: boolean;
  error: string | null;
};

export function useStadiumWeather(stadiums: string[]) {
  const key = [...new Set(stadiums)].sort().join(',');
  const prevKey = useRef('');

  const [state, setState] = useState<WeatherState>({ map: {}, loading: true, error: null });

  useEffect(() => {
    if (!key || key === prevKey.current) return;
    prevKey.current = key;

    const unique = [...new Set(stadiums)].filter((s) => STADIUM_COORDS[s]);
    setState((prev) => ({ ...prev, loading: true, error: null }));

    Promise.all(unique.map((s) => fetchWeeklyWeather(s).then((d) => [s, d] as const)))
      .then((entries) => {
        setState({ map: Object.fromEntries(entries), loading: false, error: null });
      })
      .catch(() => {
        setState((prev) => ({ ...prev, loading: false, error: '날씨 정보를 불러올 수 없어요' }));
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const getWeather = (stadium: string, isoDate: string): WeatherInfo | null =>
    state.map[stadium]?.[isoDate] ?? null;

  return { getWeather, weatherLoading: state.loading, weatherError: state.error };
}
