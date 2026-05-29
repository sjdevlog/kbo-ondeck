import type React from 'react';
import { Image } from 'react-native';
import type { SvgProps } from 'react-native-svg';

const ncPng = require('@/assets/images/teams/nc.png');

const NcLogo: React.FC<SvgProps> = ({ width = 38, height = 38 }) => (
  <Image
    source={ncPng}
    style={{ width: Number(width), height: Number(height) }}
    resizeMode="contain"
  />
);

export default NcLogo;
