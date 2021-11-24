import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { NotFoundError, requireAuth, validateRequest } from '@suup/common';

import { Review } from '../models/review';
import { LIKE_URL } from '../common/variable';
import { Like } from '../models/likes';

const router = express.Router();

router.post(
  LIKE_URL,
  requireAuth,
  [
    body('userId')
      .notEmpty()
      .custom((val) => mongoose.Types.ObjectId.isValid(val))
      .withMessage('invalid id'),
    body('postId')
      .notEmpty()
      .custom((val) => mongoose.Types.ObjectId.isValid(val))
      .withMessage('invalid id'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { userId, reviewId } = req.body;
    const review = await Review.findById(reviewId);
    if (!review) throw new NotFoundError();

    /*
       Checks the document exists in the document,
       if yes deletes that and decreases the total count
       else creates and increases the total count of likes
       */

    const like = await Like.exists({
      userId,
      reviewId,
    });
    if (like) {
      await Like.deleteOne({
        userId,
        reviewId,
      });
      review.set({ likes: review.likes-- });
      await review.save();
    } else {
      const like = await Like.build({
        userId,
        reviewId,
      });
      await like.save();
      review.set({ likes: review.likes++ });
      await review.save();
    }
  }
);
export { router as likeRouter };
