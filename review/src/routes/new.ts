import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { validateRequest } from '@suup/common';

import { Review } from '../models/review';
import { REVIEW_URL } from '../common/variable';
import { ReviewCreatedPublisher } from '../events/publishers/review-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// @TODO: require Auth

router.post(
  REVIEW_URL,
  [
    body('userId')
      .notEmpty()
      .custom((val) => mongoose.Types.ObjectId.isValid(val))
      .withMessage('invalid id'),
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
    const { userId, postId, title, description, rating } = req.body;
    const review = await Review.build({
      userId,
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
