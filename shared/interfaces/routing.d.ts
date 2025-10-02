// 3rd party libs
import { Request } from 'express';

// Interfaces
import { AdminInterface } from './admins';

export interface RequestInterface extends Request {
    isLogged: boolean;
    user?: AdminInterface;
    file?: string[];
    files?: string[][];
}