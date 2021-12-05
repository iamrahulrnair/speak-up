import {
  NotFoundError,
  validateRequest,
  requireAuth,
  requireAdminAccess,
} from '@suup/common';
import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { param } from 'express-validator';

import { POST_URL } from '../common/variable';
import { Post } from '../models/post';

const router = express.Router();

// @TODO: A post can only be deleted if he is one among the users

router.delete(
  `${POST_URL}/:postId`,
  requireAuth,
  // requireAdminAccess,
  param('postId').custom((value) => {
    return mongoose.Types.ObjectId.isValid(value);
  }),
  validateRequest,
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    const post = await Post.findByIdAndDelete(postId);
    if (!post) throw new NotFoundError();
    res.status(200).send({});
  }
);
export { router as deletePostRequestRouter };
