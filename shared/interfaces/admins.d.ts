export interface AdminInterface {
    id?: number;
    login: string;
    level: number;
    customAccess?: Array<string>;
}