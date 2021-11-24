import express, { Request, Response } from 'express';

import { Post } from '../models/post';
import { POST_URL } from '../common/variable';

const router = express.Router();

// @TODO: requireAuth

router.get(POST_URL, async (req: Request, res: Response) => {
  const posts = await Post.find().select('-reviews');
  res.status(200).send(posts);
});
export { router as getAllPostsRouter };
