// Utilities
import { functions } from '@src/utils/functions';

/* @ts-ignore */
import App from '@src/app.vue';

// Router
import router from './router';

// Load app, we put it into mp.app in order to be able to call it from chat javascript click events
functions.loadApp(App, router);