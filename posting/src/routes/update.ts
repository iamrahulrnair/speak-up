import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';

import { validateRequest, NotFoundError } from '@suup/common';
import { POST_URL } from '../common/variable';
import { Post } from '../models/post';

const router = express.Router();

// @TODO:requireAuth and require 3 among to update

router.patch(
  `${POST_URL}/:postId`,
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
    const { companyName, initialRating, imageurl } = req.body;

    if (companyName) post.set({ companyName });
    if (initialRating) post.set({ initialRating });
    if (imageurl) post.set({ imageurl });
    await post.save();
    res.send(post);
  }
);
export { router as updatePostRouter };
