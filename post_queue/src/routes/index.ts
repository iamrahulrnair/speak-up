import express, { Request, Response } from 'express';

import { Post } from '../models/post';
import { POST_URL } from '../common/variable';
import { requireAuth, requireAdminAccess } from '@suup/common';

const router = express.Router();

// @TODO: requireAuth advanced auth and permisson limited to 3 pps

router.get(
  POST_URL,
  requireAdminAccess,
  async (req: Request, res: Response) => {
    const posts = await Post.find().sort({ createdAt: 1 });
    res.status(200).send(posts);
  }
);

export { router as getAllPostRequestRouter };
