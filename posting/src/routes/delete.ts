import { NotFoundError, validateRequest } from '@suup/common';
import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { param } from 'express-validator';

import { POST_URL } from '../common/variable';
import { Post } from '../models/post';

const router = express.Router();

router.delete(
  `${POST_URL}/:postId`,
  param('postId').custom((value) => {
    return mongoose.Types.ObjectId.isValid(value);
  }),
  validateRequest,
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    try {
      await Post.findByIdAndDelete(postId);
      res.status(200).send({});
    } catch (err) {
      throw new NotFoundError();
    }
  }
);
export { router as deletePostRouter };
