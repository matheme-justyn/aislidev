import { defineConfig, presetUno, presetWebFonts } from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: ["Poppins:300,600", "Noto Sans TC:300,600"],
        heading: ["Poppins SemiBold", "Noto Sans TC SemiBold"],
        body: ["Poppins Light", "Noto Sans TC Light"],
      },
    }),
  ],
  theme: {
    colors: {
      "guting-dark": "#242424",
      "guting-light": "#FFFFFF",
      "guting-primary": "#009594",
      "guting-secondary": "#009594",
      "guting-accent1": "#C2C823",
      "guting-accent2": "#93CFBF",
      "guting-accent3": "#FFDF71",
      "guting-accent4": "#8BC560",
      "guting-accent5": "#4FB9A0",
      "guting-accent6": "#368EA5",
      "guting-link": "#4FB9A0",
      "guting-visited": "#9B9B9B",
    },
  },
});
