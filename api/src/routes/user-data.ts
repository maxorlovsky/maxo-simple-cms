// 3rd party libs
import express from 'express';

// Logger
import { log } from '@inc/log';

// Modules
import UserDataModule from '@modules/user-data';

// Interfaces
import { RequestInterface } from '@shared/interfaces/routing';
import { MeResponseInterface } from '@shared/interfaces/login';

// Define router
const router: express.Router = express.Router();
const userDataModule = new UserDataModule();

router.get('/me', async (req: RequestInterface, res: express.Response): Promise<void> => {
  if (req.isLogged) {
    res.status(200).json({
      status: true,
      user: req.user
    } as MeResponseInterface);

    return;
  }

  res.status(401).json({
    status: false,
    message: 'Authorization error'
  } as MeResponseInterface);
});

router.post('/logout', async (req: RequestInterface, res: express.Response): Promise<void> => {
  await userDataModule.logout(req.user);

  if (req.user.id) {
    await log({
      userId: req.user?.id,
      module: 'logout',
      type: 'success',
      info: `Success logout <b>${req.user?.login}</b>`
    });
  }

  // Always return true
  res.status(200).json({
    status: true,
  });
});

router.get('/menu', async (req: RequestInterface, res: express.Response): Promise<boolean> => {
  const data = await userDataModule.fetchMenu(req.user);

  if (!data) {
    res.status(401).json({
      message: 'Error fetching the menu'
    });

    return false;
  }

  // Passing session token to the user
  res.status(200).json(data);
});

/*router.put('/user-data/change-password', async (req: RequestInterface, res: express.Response): Promise<boolean> => {
  if (!req.isLogged) {
    res.status(401).json({
      message: 'Authorization error'
    });

    return false;
  }

  const attributes = {
    currentPass: req.body.currentPass.toString(),
    newPass: req.body.newPass.toString(),
    repeatPass: req.body.repeatPass.toString()
  };

  const userData = new UserData(req.user);

  const checkForm = await userData.updatePassword(attributes);

  if (!checkForm) {
    res.status(400).json({
      message: userData.getMessage(),
      fields: userData.getFields()
    });

    await log({
      userId: req.user.id,
      module: 'user',
      type: 'password-change',
      info: `Password change failed [<b>${userData.getMessage()}</b>]`
    });

    return false;
  }

  await log({
    userId: req.user.id,
    module: 'user',
    type: 'password-change',
    info: 'Password change success'
  });

  // Passing session token to the user
  res.status(200).json({
    state: 'success',
    message: 'Password updated'
  });
});*/

export default router;