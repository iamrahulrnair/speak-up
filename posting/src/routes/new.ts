import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { requireAuth, validateRequest, requireAdminAccess } from '@suup/common';

import { Post } from '../models/post';
import { POST_URL } from '../common/variable';

// @TODO: use enum to check 1 of three userIds

const router = express.Router();

router.post(
  POST_URL,
  requireAuth,
  requireAdminAccess,
  [
    body('userId')
      .notEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('userid is invalid'),
    body('companyName').notEmpty().isString().withMessage('invalid input'),
    body('initialRating')
      .notEmpty()
      .isInt({ gt: 0, lt: 6 })
      .withMessage('invalid rating'),
    body('imageUrl').notEmpty().isString().withMessage('invalid image url'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { userId, companyName, initialRating, imageurl } = req.body;
    const post = Post.build({
      userId,
      companyName,
      imageurl,
    });
    await post.save();
    res.send(201).send(post);
  }
);
export { router as createPostRouter };
