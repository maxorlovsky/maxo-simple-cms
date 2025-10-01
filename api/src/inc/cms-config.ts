export interface CmsConfigInterface {
  dbLoaded: boolean;
  availableLoginAttempts: number;
  maxLevel: number;
  minPasswordLength: number;
  corsDomains: string[];
  corsHeaders: string;
}

export const cmsConfig: CmsConfigInterface = {
  dbLoaded: false,
  availableLoginAttempts: 5,
  maxLevel: 3,
  minPasswordLength: 6,
  corsDomains: [],
  corsHeaders: 'sessionToken, siteId'
};