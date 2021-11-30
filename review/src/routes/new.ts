import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { BadRequestError, requireAuth, validateRequest } from '@suup/common';

import { Review } from '../models/review';
import { REVIEW_URL } from '../common/variable';
import { ReviewCreatedPublisher } from '../events/publishers/review-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import { Post } from '../models/post';

const router = express.Router();

// @TODO: require Auth

router.post(
  REVIEW_URL,
  requireAuth,
  [
    body('postId')
      .notEmpty()
      .custom((val) => mongoose.Types.ObjectId.isValid(val))
      .withMessage('invalid id'),
    body('title').notEmpty().isString().withMessage('title should be provided'),
    body('description').notEmpty(),
    body('rating').notEmpty(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { postId, title, description, rating } = req.body;
    const _check = await Review.exists({
      userId: req.currentUser!.id,
      postId,
    });
    const _check_post = await Post.exists({
      _id: postId,
    });

    if (_check) throw new BadRequestError('User comment exists with this post');
    if (!_check_post)
      throw new BadRequestError('cannot create anonymous review');

    const review = await Review.build({
      userId: req.currentUser!.id,
      postId,
      title,
      description,
      rating,
    });
    await review.save();
    new ReviewCreatedPublisher(natsWrapper.client).publish({
      id: review.id,
      userId: review.userId,
      postId: review.postId,
      title: review.title,
      description: review.description,
      rating: review.rating,
      version: review.version,
    });
    res.send(review);
  }
);
export { router as createReviewRouter };
