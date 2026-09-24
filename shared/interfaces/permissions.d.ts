export interface PermissionInterface {
  key: string;
  name: string;
  strict: boolean;
  level: number;
  new: boolean;
  subCategories: PermissionInterface[];
}