import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  requireAdminAccess,
  BadRequestError,
} from '@suup/common';

import { Post } from '../models/post';
import { POST_URL } from '../common/variable';
// @TODO: use enum to check 1 of three userIds

const router = express.Router();

// @TODO: for normal ppl auth

router.post(
  POST_URL,
  requireAuth,
  [
    body('companyName').notEmpty().isString().withMessage('invalid input'),
    body('imageUrl').notEmpty().isString().withMessage('invalid image url'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const companyName = req.body.companyName.toLowerCase();
    const { imageUrl } = req.body;

    const _check = await Post.exists({ companyName });
    if (_check) throw new BadRequestError('Company Exists');

    const post = Post.build({
      userId: req.currentUser!.id,
      companyName,
      imageurl: imageUrl,
    });
    await post.save();
    res.status(201).send(post);
  }
);
export { router as createPostRequestRouter };
