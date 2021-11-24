import { NotFoundError, validateRequest, requireAuth } from '@suup/common';
import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { param } from 'express-validator';

import { REVIEW_URL } from '../common/variable';
import { Review } from '../models/review';
import { ReviewDeletedPublisher } from '../events/publishers/review-deleted-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  `${REVIEW_URL}/:reviewId`,
  param('reviewId').custom((value) => {
    return mongoose.Types.ObjectId.isValid(value);
  }),
  validateRequest,
  async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    try {
      const review = await Review.findOneAndDelete({
        reviewId,
        userId: req.currentUser!.id,
      });
      //   @TODO: event publisher
      if (!review) throw new NotFoundError();

      new ReviewDeletedPublisher(natsWrapper.client).publish({
        id: review.id,
      });
      res.status(200).send({});
    } catch (err) {
      throw new NotFoundError();
    }
  }
);
export { router as deleteReviewRouter };
