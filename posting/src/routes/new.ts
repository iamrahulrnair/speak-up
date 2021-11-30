import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, requireAdminAccess } from '@suup/common';
import { PostCreatedEventPublisher } from '../events/publishers/post-created-publisher';

import { Post } from '../models/post';
import { POST_URL } from '../common/variable';
import { natsWrapper } from '../nats-wrapper';

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

    new PostCreatedEventPublisher(natsWrapper.client).publish({
      id: post.id,
    });

    res.status(201).send(post);
  }
);
export { router as createPostRouter };
