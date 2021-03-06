import { NotFoundError, errorHandler, currentUser } from '@suup/common';
import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { getAllReviewRouter } from './routes';
import { updateReviewRouter } from './routes/update';
import { deleteReviewRouter } from './routes/delete';
import { createReviewRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(express.json());

app.use(
  cookieSession({
    name: '_a',
    secure: process.env.NODE_ENV != 'test',
    signed: false,
  })
);

app.use(currentUser);

app.use(getAllReviewRouter);
app.use(updateReviewRouter);
app.use(updateReviewRouter);
app.use(deleteReviewRouter);
app.use(createReviewRouter);

app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
