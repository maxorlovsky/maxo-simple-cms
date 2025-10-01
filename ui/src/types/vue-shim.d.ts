import Vue from 'vue';
import { Router, RouteRecordRaw } from 'vue-router';

declare module 'vue' {
  export default Vue;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $route: RouteRecordRaw;
    $router: Router;
  }
}