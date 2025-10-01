// 3rd party libs
import express from 'express';

// Logger
import { log } from '@inc/log';

// Modules
import LoginModule from '../modules/login';

// Helpers
import { sanitizeString } from '@src/helpers/sanitize';

// Interfaces
import type { RequestInterface } from '@shared/interfaces/routing';
import type { LoginRequestInterface, LoginResponseInterface } from '@shared/interfaces/login';

// Define router
const router: express.Router = express.Router();
const loginModule = new LoginModule();

router.post('/login', async (req: RequestInterface, res: express.Response): Promise<void> => {
  // In case user is already authorized, we ignore login endpoint
  if (req.isLogged) {
    res.status(405).json({
      status: false,
      message: 'Already authorized'
    });
  }

  const attributes: LoginRequestInterface = {
    login: sanitizeString(req.body.login),
    password: sanitizeString(req.body.password),
  };
  const response = await loginModule.login(attributes);

  if (response.status) {
    // Passing session token to the user
    res.status(200).json({
      status: true,
      sessionToken: response.sessionToken
    } as LoginResponseInterface);

    await log({
      userId: null,
      module: 'login',
      type: 'success',
      info: `Success login as <b>${attributes.login}</b>`
    });

    return;
  }

  res.status(400).json({
    status: false,
    message: response.message
  } as LoginResponseInterface);

  await log({
    userId: null,
    module: 'login',
    type: 'fail',
    info: `Error login as <b>${attributes.login}</b> (${response.message})`
  });
});

export default router;