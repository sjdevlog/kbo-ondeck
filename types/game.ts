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
