import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isTablet = width >= 768;
export const isDesktop = width >= 1024;

export const getResponsiveSize = (mobile, tablet, desktop) => {
  if (isDesktop && desktop !== undefined) return desktop;
  if (isTablet && tablet !== undefined) return tablet;
  return mobile;
};

export const screenDimensions = {
  width,
  height,
};