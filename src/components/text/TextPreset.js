import { Typography } from "../../theme/Typography";

const BASE = {
  fontFamily: Typography.regular,
  fontSize: 16,
};
const PRIMARY_BASE = {
  fontFamily: Typography.regular,
  fontSize: 16,
};
const BASE_BOLD = {
  fontFamily: Typography.bold,
};

const BOLD = {
  fontFamily: Typography.bold,
};

export const presets = {
  default: BASE,
  bold: BOLD,
  h1: {
    ...BOLD,
    fontSize: 32,
  },
  h2: {
    ...BOLD,
    fontSize: 28,
  },
  h3: {
    ...BASE_BOLD,
    fontSize: 24,
  },
  h4: {
    ...BOLD,
    fontSize: 16,
  },
  p: {
    ...BASE,
    fontSize: 16,
  },

  small: {
    ...PRIMARY_BASE,
    fontSize: 14,
  },
};
