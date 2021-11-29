import {
  NotFoundError,
  requireAdminAccess,
  requireAuth,
  validateRequest,
} from '@suup/common';
import express, { Request, Response } from 'express';
import { POST_URL } from '../common/variable';
import { param } from 'express-validator';
import mongoose from 'mongoose';

import { Post } from '../models/post';
import { Review } from '../models/review';

const router = express.Router();

// @TODO: requireAuth

router.get(
  `${POST_URL}/:postId`,
  requireAuth,
  param('postId')
    .custom((value) => {
      return mongoose.Types.ObjectId.isValid(value);
    })
    .withMessage('invalid id'),
  validateRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate('reviewId');
    const reviews = await Review.find({ postId });
    if (!post) throw new NotFoundError();
    res.send({
      post,
      reviews,
    });
  }
);
export { router as getPostRouter };
