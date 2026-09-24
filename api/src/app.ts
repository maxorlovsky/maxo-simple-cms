// 3rd party libs
import express from 'express';
import { createServer, Server } from 'http';
import rateLimit from 'express-rate-limit';

// Inc
import '@inc/db';
import { cmsConfig } from '@src/inc/cms-config';

// Import CORS rules
import cors from '@inc/cors';

// Middlewares
import authMiddleware from './middleware/auth';

// Helpers
import { publicPath } from '@helpers/general';

// Routes
import loginRoutes from './routes/login';
/*import adminsRoutes from './routes/admins';
import labelsRoutes from './routes/labels';
import logsRoutes from './routes/logs';
import pagesRoutes from './routes/pages';*/
import permissionsRoutes from './routes/permissions';
import userDataRoutes from './routes/user-data';
import homeRoutes from './routes/home';

// Create a new express application instance
const app: express.Application = express();
const server: Server = createServer(app);
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100
});

// Apply CORS config
app.use(cors);

// Apply rate limiter
app.set('trust proxy', 1);
app.use('/', apiLimiter);

app.use(express.json());

// Apply middleware
app.use('/private', authMiddleware);

// Define static files
app.use(express.static(publicPath));

// Initiate the routes
app.use('/', loginRoutes);
/*app.use('/', adminsRoutes);
app.use('/', labelsRoutes);
app.use('/', logsRoutes);
app.use('/', pagesRoutes);*/
app.use('/private', permissionsRoutes);
app.use('/private', userDataRoutes);
app.use('/', homeRoutes);

// Creating an event to watch if database finished loading, until then we just reloop every 2 seconds
function startApp(): void {
  if (!cmsConfig.dbLoaded) {
    // eslint-disable-next-line
    console.log('[DB] Waiting connection...');

    setTimeout(() => startApp(), 2000);
  }
}

startApp();

server.listen(8525, (): void => {
  // eslint-disable-next-line
  console.log('App listening on port 8525!');
});