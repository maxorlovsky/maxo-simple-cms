// 3rd party libs
import { ref } from 'vue';

export const isMobileOpen = ref(false);

export function setIsMobileOpen(value: boolean) {
  isMobileOpen.value = value;
}

export const navigationMenu = ref([]);

export function setNavigationMenu(value: any) {
  navigationMenu.value = value;
}