// 3rd party libs
import express from 'express';
// Use Prisma client instead of TypeORM
import { prisma } from '@inc/db';

// Entities
// Prisma models used via the Prisma client

// Interfaces
import type { RequestInterface } from '@shared/interfaces/routing';

export default async (req: RequestInterface, res: express.Response, next: express.NextFunction): Promise<boolean | void> => {
  // Marking user as logged out by default
  req.isLogged = false;

  if (req.get('sessionToken')) {
    const sessionToken = req.get('sessionToken');

    // Checking if user auth token is still viable and if yes, fetching user
    const authRecord = await prisma.mo_users_auth.findFirst({
      where: {
        token: sessionToken
      }
    });

    if (authRecord) {
      // fetch the admin user by userId
      let admin = null;

      if (authRecord.userId) {
        admin = await prisma.mo_admins.findUnique({
          where: {
            id: authRecord.userId
          }
        });
      }

      if (admin) {
        // Check if user is not deleted
        if (admin.deleted) {
          res.status(403).json({
            message: 'Access denied, admin is removed'
          });

          return false;
        }

        // Saving user for future reference
        req.isLogged = true;
        // Parse customAccess safely
        let customAccessArray: string[] = [];

        try {
          customAccessArray = admin.customAccess ? JSON.parse(admin.customAccess) : [];
        } catch {
          customAccessArray = [];
        }

        req.user = {
          id: admin.id,
          login: admin.login,
          level: admin.level,
          customAccess: Array.isArray(customAccessArray) ? customAccessArray : []
        };

        // Breaking down current path
        const breakdown = req.originalUrl.split('/');
        const path = breakdown[1];

        const menu = await prisma.mo.findFirst({
          where: {
            setting: 'menu'
          }
        });

        // Getting menu permissions
        const permissions = menu && menu.value ? JSON.parse(menu.value) : [];

        // Checking if user have a level and not custom access
        if (req.user.level > 0) {
          /*
            Searching for index of permission and if it exist, trying to get it level, by default level should be 0
            meaning that all every endpoint is open by default
          */
          const index = permissions.findIndex((permission): boolean => permission.key === path || permission.key === `${path}s`);
          let level = 0;

          if (index >= 0) {
            level = permissions[index].level;
          }

          // If user level is lower, then sending access denied
          if (req.user.level < level) {
            res.status(403).json({
              message: 'Access denied'
            });

            return false;
          }
        } else {
          // Assuming that user have custom access
          // Special cases, to fetch stats with custom access
          // ensure customAccess is an array and add special cases
          req.user.customAccess = req.user.customAccess || [];
          req.user.customAccess.push('multisite', 'menu', 'me', 'user-data', 'dashboard');

          // Check if user level is enough to use this API endpoint
          if (req.user.customAccess.indexOf(path) === -1 && req.user.customAccess.indexOf(`${path}s`) === -1) {
            res.status(403).json({
              message: 'Access denied'
            });

            return false;
          }
        }
      }
    }
  } else {
    res.status(401).json({
      message: 'Authorization error'
    });

    return false;
  }

  next();
};