import { NotFoundError, errorHandler } from '@suup/common';
import express from 'express';
import 'express-async-errors';

import { getAllPostsRouter } from './routes';
import { getPostRouter } from './routes/show';
import { updatePostRouter } from './routes/update';
import { deletePostRouter } from './routes/delete';
import { createPostRouter } from './routes/new';
import { likeRouter } from './routes/like';

const app = express();
app.set('trust proxy', true);
app.use(express.json());

app.use(getAllPostsRouter);
app.use(getPostRouter);
app.use(updatePostRouter);
app.use(deletePostRouter);
app.use(createPostRouter);
app.use(likeRouter);

app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
