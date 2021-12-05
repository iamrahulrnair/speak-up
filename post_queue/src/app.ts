import { NotFoundError, errorHandler, currentUser } from '@suup/common';
import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { getAllPostRequestRouter } from './routes';
import { getMyRequest } from './routes/show-my-request';
import { deletePostRequestRouter } from './routes/delete';
import { createPostRequestRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(express.json());

app.use(
  cookieSession({
    name: '_a',
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use(getAllPostRequestRouter);
app.use(getMyRequest);
app.use(createPostRequestRouter);
app.use(deletePostRequestRouter);

app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
