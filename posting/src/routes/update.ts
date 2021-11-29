import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';

import {
  validateRequest,
  NotFoundError,
  requireAuth,
  requireAdminAccess,
} from '@suup/common';
import { POST_URL } from '../common/variable';
import { Post } from '../models/post';

const router = express.Router();

// @TODO:requireAuth and require 3 among to update

router.patch(
  `${POST_URL}/:postId`,
  requireAuth, //requireAdminAccess,
  param('postId')
    .custom((value) => {
      return mongoose.Types.ObjectId.isValid(value);
    })
    .withMessage('invalid id'),
  validateRequest,
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) throw new NotFoundError();
    const { companyName, ratingsAverage, imageUrl, ratingsCount } = req.body;

    if (companyName) post.set({ companyName });
    if (ratingsAverage) post.set({ ratingsAverage });
    if (imageUrl) post.set({ imageurl: imageUrl });
    if (ratingsCount) post.set({ ratingsCount });
    await post.save();
    res.send(post);
  }
);
export { router as updatePostRouter };
