// 3rd party libs
import * as express from 'express';

// Logger
import { log } from '@inc/log';

// Modules
import PermissionsModule from '@modules/permissions';

// Interfaces
import { RequestInterface } from '@shared/interfaces/routing';
import { PermissionInterface } from '@shared/interfaces/permissions';

// Define router
const router: express.Router = express.Router();
const permissionsModules = new PermissionsModule();

router.get('/permissions', async (req: RequestInterface, res: express.Response): Promise<void> => {
  const permissions = await permissionsModules.getPermissions();

  // Passing session token to the user
  res.status(200).json({
    status: true,
    data: permissions
  });
});

router.put('/permissions', async (req: RequestInterface, res: express.Response): Promise<boolean> => {
  // Trying to update permissions
  const permissions = await permissionsModules.updatePermissions(req.body as PermissionInterface[]);

  // If there is an error, sending fields and message and logging error
  if (!permissions.status) {
    res.status(400).json(permissions);

    // Log fail
    await log({
      userId: req.user.id,
      module: 'permissions',
      type: 'edit',
      info: `Permissions update failed <b>${permissions.message}</b>`
    });

    return false;
  }

  // Log success
  await log({
    userId: req.user.id,
    module: 'permissions',
    type: 'edit',
    info: 'Permissions updated'
  });

  // Passing status
  res.status(200).json({
    status: true
  });
});

export default router;