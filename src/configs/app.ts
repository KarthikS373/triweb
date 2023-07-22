import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import routes from '../routers';
import { errorConverter, errorHandler } from '../utils/error-handling/runtime-error-handler';

const app = express();

/* Parsers and security HTTP headers */
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Cors */
app.use(cors());
app.options('*', cors());

/* API routes */
app.use(`/api`, routes);

/* Error Handling */
app.use(errorConverter);
app.use(errorHandler);

export default app;
