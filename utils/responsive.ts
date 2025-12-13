import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const isTablet = () => {
  const aspectRatio = height / width;
  return Math.min(width, height) >= 600 && aspectRatio < 1.6;
};

export const responsivePadding = () => (isTablet() ? 40 : 20);

export const responsiveWidth = (percentage: number) =>
  isTablet() ? Math.min(width * percentage, 600) : width * percentage;
