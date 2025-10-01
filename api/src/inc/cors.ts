// 3rd party libs
import express from 'express';

// Inc
import { cmsConfig } from '@src/inc/cms-config';

// Interfaces
import type { RequestInterface } from '@shared/interfaces/routing';

export default (req: RequestInterface, res: express.Response, next: express.NextFunction): void => {
  if (cmsConfig.corsDomains.indexOf(req.get('origin')) > -1) {
    res.header('Access-Control-Allow-Origin', req.get('origin'));
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', `Origin, X-Requested-With, Content-Type, Accept, ${cmsConfig.corsHeaders}`);

  next();
};