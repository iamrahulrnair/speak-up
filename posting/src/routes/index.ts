import express, { Request, Response } from 'express';

import { Post } from '../models/post';
import { POST_URL } from '../common/variable';
import { requireAuth } from '@suup/common';

const router = express.Router();

// @TODO: requireAuth and permisson limited to 3 pps

router.get(POST_URL, requireAuth, async (req: Request, res: Response) => {
  const posts = await Post.find().select('-reviews');
  res.status(200).send(posts);
});
export { router as getAllPostsRouter };
