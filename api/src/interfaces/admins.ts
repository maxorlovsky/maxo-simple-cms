export interface AdminFormInterface {
    id?: number;
    login: string;
    password: string;
    level: number;
    permissions: Array<string>;
}