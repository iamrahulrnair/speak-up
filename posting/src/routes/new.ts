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
  // requireAdminAccess,
  [
    body('companyName').notEmpty().isString().withMessage('invalid input'),
    body('imageUrl').notEmpty().isString().withMessage('invalid image url'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { companyName, imageUrl } = req.body;
    const post = Post.build({
      userId: req.currentUser!.id,
      companyName,
      imageurl: imageUrl,
    });
    await post.save();
    res.status(201).send(post);
  }
);
export { router as createPostRouter };
