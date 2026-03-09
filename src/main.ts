import { createApp } from "vue";
import App from "./App.vue";

console.log('[AISliDev] Starting application...');

try {
  const app = createApp(App);
  app.mount("#app");
  console.log('[AISliDev] Application mounted successfully');
} catch (error) {
  console.error('[AISliDev] Failed to mount application:', error);
}
