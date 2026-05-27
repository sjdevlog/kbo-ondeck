import type React from 'react';
import type { SvgProps } from 'react-native-svg';

import KiaLogo     from '@/assets/images/teams/kia.svg';
import DoosanLogo  from '@/assets/images/teams/doosan.svg';
import SamsungLogo from '@/assets/images/teams/samsung.svg';
import LotteLogo   from '@/assets/images/teams/lotte.svg';
import NcLogo      from '@/assets/images/teams/nc.svg';
import LgLogo      from '@/assets/images/teams/lg.svg';
import SsgLogo     from '@/assets/images/teams/ssg.svg';
import KtLogo      from '@/assets/images/teams/kt.svg';
import HanwhaLogo  from '@/assets/images/teams/hanwha.svg';
import KiwoomLogo  from '@/assets/images/teams/kiwoom.svg';

export const TEAM_LOGOS: Record<string, React.FC<SvgProps>> = {
  'KIA 타이거즈':  KiaLogo,
  '두산 베어스':   DoosanLogo,
  '삼성 라이온즈': SamsungLogo,
  '롯데 자이언츠': LotteLogo,
  'NC 다이노스':   NcLogo,
  'LG 트윈스':    LgLogo,
  'SSG 랜더스':   SsgLogo,
  'KT 위즈':      KtLogo,
  '한화 이글스':   HanwhaLogo,
  '키움 히어로즈': KiwoomLogo,
};
