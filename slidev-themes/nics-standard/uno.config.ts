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
      "nics-dark": "#242424",
      "nics-light": "#FFFFFF",
      "nics-primary": "#009594",
      "nics-secondary": "#009594",
      "nics-accent1": "#C2C823",
      "nics-accent2": "#93CFBF",
      "nics-accent3": "#FFDF71",
      "nics-accent4": "#8BC560",
      "nics-accent5": "#4FB9A0",
      "nics-accent6": "#368EA5",
      "nics-link": "#4FB9A0",
      "nics-visited": "#9B9B9B",
    },
  },
});
