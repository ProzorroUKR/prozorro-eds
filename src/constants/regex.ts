export const REGEX = {
  FILE: {
    TYPE: {
      AUDIT: /^audit_.+\.yaml$/i,
      INVOICE: /(?<type>XML|KVT)\.p7s/,
    },
  },
  NUMBER: {
    EIGHT_SYMBOLS: /^\d{8}$/,
  },
} as const;
