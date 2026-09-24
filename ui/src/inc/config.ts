// 3rd party libs
import { ref } from 'vue';
import { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [];
export const serverUrl: string = import.meta.env.PROD ? 'https://your-prod-url-to-admin-panel.com' : '';
export const apiUrl: string = '/maxo-simple-cms-api';
export const environment: string = import.meta.env.PROD ? 'prod' : 'dev';
export const version = ref<string>('0.0.0');
export const projectName = ref<string>('');
export const maxLevel = ref<number>(1);

/**
 * Lazy-loads ../../../config.json and updates exported `version`.
 * If the file doesn't exist or fails to load, this will silently keep the default value
 * (no build crash).
 */
export async function loadConfig(): Promise<void> {
  try {
    // dynamic import of JSON — if the file is missing this will throw and be caught
    const mod = await import('../../../config.json');

    // Vite wraps JSON as the default export; support both shapes
    const cfg: any = (mod && (mod.default ?? mod)) || {};

    if (cfg.version) {
      version.value = String(cfg.version);
    }

    if (cfg.title) {
      projectName.value = String(cfg.title);
    }

    if (cfg.maxLevel) {
      maxLevel.value = Number(cfg.maxLevel);
    }
  } catch (error) {
    // fail silently in production; warn in dev for debugging
    if (!import.meta.env.PROD) {
      console.warn('Could not load config.json, using defaults:', error);
    }
  }
}

// Start loading in background by default so `version` will be updated when ready.
// If you prefer to control loading, remove the line below and call `loadConfig()` from your app startup (e.g. in main.ts).
export const configLoadPromise = loadConfig();