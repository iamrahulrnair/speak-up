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
import { PostDeletedPublisher } from '../events/publishers/post-deleted-publisher';
import { natsWrapper } from '../nats-wrapper';
import { Review } from '../models/review';

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
    try {
      const post = await Post.findByIdAndDelete(postId);
      if (!post) throw new NotFoundError();

      new PostDeletedPublisher(natsWrapper.client).publish({
        id: post.id,
      });
      await Review.deleteMany({
        id: post.id,
      });

      res.status(200).send({});
    } catch (err) {
      throw new NotFoundError();
    }
  }
);
export { router as deletePostRouter };
