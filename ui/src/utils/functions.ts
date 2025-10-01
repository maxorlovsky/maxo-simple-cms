// 3rd party libs
import { createApp } from 'vue';

// Inc
import { version } from '@src/inc/config';

const functions = {
  loadApp: async(App: any, router: any) => {
    // Load app
    const app = createApp(App);

    // Add router
    app.use(router);

    // Mouint to parent element
    app.mount('#app');

    return app;
  },
  storage: (func: any, key: any, ...args: any) => {
    let timeoutSeconds = 604800000 * 90;

    if (args[1]) {
      timeoutSeconds = args[1];
    }

    // Set item
    if (func === 'set') {
      // If any parameter is empty, we don't do anything
      if (!func || !key || (!args[0] && args[0] !== false && args[0] !== 0)) {
        return null;
      }

      const saveData = {
        data: args[0],
        time: new Date().getTime() + timeoutSeconds,
        version: version
      };

      localStorage.setItem(key, JSON.stringify(saveData));
    } else if (func === 'get') {
      // Check if there is something for specified key
      if (!localStorage.getItem(key)) {
        return null;
      }

      const returnValue = JSON.parse(localStorage.getItem(key));

      return returnValue.data;
    } else if (func === 'remove') {
      localStorage.removeItem(key);
    } else {
      return null;
    }

    return true;
  },
  storageCacheBuster: (): boolean => {
    const storagesKeys: string[] = ['structure-data', 'structure-user-data'];

    if (!storagesKeys.length) {
      return false;
    }

    // If version was bumped, we might still use outdated localStorage data, doing full cleanup
    if (localStorage.getItem('version') !== version) {
      for (const value of storagesKeys) {
        localStorage.removeItem(value);
      }

      // Saving version to not cleaup everything again until the next bump
      localStorage.setItem('version', version);
    }

    return true;
  },
};

export { functions };