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
  // statiz 단축 구장명 추가
  '잠실':   { lat: 37.5122, lon: 127.0719 },
  '문학':   { lat: 37.4370, lon: 126.6930 },
  '수원':   { lat: 37.2997, lon: 127.0097 },
  '대구':   { lat: 35.8412, lon: 128.6814 },
  '광주':   { lat: 35.1681, lon: 126.8892 },
  '사직':   { lat: 35.1941, lon: 129.0613 },
  '대전':   { lat: 36.3175, lon: 127.4297 },
  '창원':   { lat: 35.2226, lon: 128.5822 },
  '고척':   { lat: 37.4983, lon: 126.8676 },
};

function codeToWeather(code: number): { icon: string; label: string } {
  if (code === 0)  return { icon: '☀️',  label: '맑음'   };
  if (code <= 3)   return { icon: '⛅',  label: '구름'   };
  if (code <= 48)  return { icon: '🌫️', label: '안개'   };
  if (code <= 55)  return { icon: '🌦️', label: '이슬비' };
  if (code <= 65)  return { icon: '🌧️', label: '비'     };
  if (code <= 75)  return { icon: '❄️',  label: '눈'     };
  if (code <= 82)  return { icon: '🌩️', label: '소나기' };
  return                  { icon: '⛈️',  label: '뇌우'   };
}

// 캐시: `stadium:isoDate` → WeatherInfo
const cache: Record<string, WeatherInfo> = {};

async function fetchDayWeather(stadium: string, isoDate: string): Promise<WeatherInfo | null> {
  const key = `${stadium}:${isoDate}`;
  if (cache[key]) return cache[key];

  const coords = STADIUM_COORDS[stadium];
  if (!coords) return null;

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${coords.lat}&longitude=${coords.lon}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=Asia%2FSeoul&start_date=${isoDate}&end_date=${isoDate}`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json();
  if (!data.daily?.time?.length) return null;

  const code = data.daily.weather_code[0] as number;
  const info: WeatherInfo = {
    tempMax: Math.round(data.daily.temperature_2m_max[0]),
    tempMin: Math.round(data.daily.temperature_2m_min[0]),
    code,
    ...codeToWeather(code),
  };
  cache[key] = info;
  return info;
}

export function useStadiumWeather(stadiums: string[], isoDate: string) {
  const key = [...new Set(stadiums)].sort().join(',') + ':' + isoDate;
  const prevKey = useRef('');

  const [map, setMap] = useState<Record<string, WeatherInfo>>({});
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    if (!isoDate || !stadiums.length || key === prevKey.current) return;
    prevKey.current = key;

    const unique = [...new Set(stadiums)].filter((s) => STADIUM_COORDS[s]);
    if (!unique.length) { setWeatherLoading(false); return; }

    setWeatherLoading(true);
    Promise.all(unique.map((s) => fetchDayWeather(s, isoDate).then((d) => [s, d] as const)))
      .then((entries) => {
        const result: Record<string, WeatherInfo> = {};
        entries.forEach(([s, d]) => { if (d) result[s] = d; });
        setMap(result);
        setWeatherLoading(false);
      })
      .catch(() => {
        setWeatherLoading(false);
        setWeatherError('날씨 정보를 불러올 수 없어요');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const getWeather = (stadium: string): WeatherInfo | null => map[stadium] ?? null;

  return { getWeather, weatherLoading, weatherError };
}
