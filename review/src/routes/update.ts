import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { validateRequest, NotFoundError, requireAuth } from '@suup/common';
import mongoose from 'mongoose';

import { Review } from '../models/review';
import { REVIEW_URL } from '../common/variable';
import { ReviewUpdatedPublisher } from '../events/publishers/review-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.patch(
  `${REVIEW_URL}/:reviewId`,
  requireAuth,
  [
    param('reviewId')
      .custom((value) => {
        return mongoose.Types.ObjectId.isValid(value);
      })
      .withMessage('invalid id'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new NotFoundError();
    }
    const { title, description, rating } = req.body;
    if (title) review.set({ title });
    if (description) review.set({ description });
    if (rating) review.set({ rating });
    await review.save();
    // event publisher
    new ReviewUpdatedPublisher(natsWrapper.client).publish({
      id: review.id,
      title: title ? review.title : undefined,
      description: description ? review.description : undefined,
      rating: rating ? review.rating : undefined,
      version: review.version,
    });
    res.send(review);
  }
);

export { router as updateReviewRouter };
