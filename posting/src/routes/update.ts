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
    /**
     * not using set as it causes the updateifplugin to trigger ,
     * which causes version mismatch,
     * updateOne doesnt causes pre save hooks to exectue.
     */
    if (companyName) await Post.updateOne({ _id: postId }, { companyName });
    if (ratingsAverage)
      await Post.updateOne({ _id: postId }, { ratingsAverage });
    if (imageUrl) await Post.updateOne({ _id: postId }, { imageUrl });
    if (ratingsCount) await Post.updateOne({ _id: postId }, { ratingsCount });
    const _post = await Post.findById(postId);
    res.send(_post);
  }
);
export { router as updatePostRouter };
