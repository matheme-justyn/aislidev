// index.ts - Theme entry point
import { resolve } from "path";

export default {
  colorSchema: "light",
  highlighter: "shiki",
  fonts: {
    sans: "Poppins, Noto Sans TC",
    serif: "Poppins, Noto Sans TC",
    mono: "Fira Code, monospace",
    heading: "Poppins SemiBold, Noto Sans TC SemiBold",
    body: "Poppins Light, Noto Sans TC Light",
  },
  layouts: {
    cover: resolve(__dirname, "./layouts/cover.vue"),
    default: resolve(__dirname, "./layouts/default.vue"),
    "vertical-text": resolve(__dirname, "./layouts/vertical-text.vue"),
    "vertical-title": resolve(__dirname, "./layouts/vertical-title.vue"),
  },
};
