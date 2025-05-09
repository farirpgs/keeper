import {
  amberDark,
  blueDark,
  bronzeDark,
  brownDark,
  crimsonDark,
  cyanDark,
  goldDark,
  grassDark,
  grayDark,
  greenDark,
  indigoDark,
  irisDark,
  jadeDark,
  limeDark,
  mintDark,
  orangeDark,
  pinkDark,
  plumDark,
  purpleDark,
  redDark,
  rubyDark,
  skyDark,
  tealDark,
  tomatoDark,
  violetDark,
  yellowDark,
} from "@radix-ui/colors";
import type { UI } from "../../components/ui/ui";

export const Colors = {
  getAccentColors() {
    return radixColors;
  },
  getLightColor(
    color: ColorType,
    level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
  ) {
    return radixDarkColors[color][color + level];
  },
  getDarkColor(
    color: ColorType,
    level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
  ) {
    return radixDarkColors[color][color + level];
  },
};

const radixColors = [
  "gray",
  "tomato",
  "red",
  "ruby",
  "crimson",
  "pink",
  "plum",
  "purple",
  "violet",
  "iris",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "jade",
  "green",
  "grass",
  "brown",
  "bronze",
  "gold",
  "sky",
  "mint",
  "lime",
  "yellow",
  "amber",
  "orange",
] as const;

export type ColorType = Required<UI.ThemeProps>["accentColor"];

const radixDarkColors: Record<ColorType, any> = {
  gray: grayDark,
  tomato: tomatoDark,
  red: redDark,
  ruby: rubyDark,
  crimson: crimsonDark,
  pink: pinkDark,
  plum: plumDark,
  purple: purpleDark,
  violet: violetDark,
  iris: irisDark,
  indigo: indigoDark,
  blue: blueDark,
  cyan: cyanDark,
  teal: tealDark,
  jade: jadeDark,
  green: greenDark,
  grass: grassDark,
  brown: brownDark,
  bronze: bronzeDark,
  gold: goldDark,
  sky: skyDark,
  mint: mintDark,
  lime: limeDark,
  yellow: yellowDark,
  amber: amberDark,
  orange: orangeDark,
};
