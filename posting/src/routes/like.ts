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
    body('reviewId')
      .notEmpty()
      .custom((val) => mongoose.Types.ObjectId.isValid(val))
      .withMessage('invalid id'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { reviewId } = req.body;
    const userId = req.currentUser!.id;
    const _check = await Review.exists({ reviewId });

    if (!_check) throw new NotFoundError();
    const review = await Review.findOne({ reviewId, userId });
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
      await Review!.updateOne({ likes: --review!.likes });
      res.send(review);
    } else {
      const like = await Like.build({
        userId,
        reviewId,
      });
      await like.save();
      await Review!.updateOne({ likes: ++review!.likes });
      res.send(review);
    }
  }
);
export { router as likeRouter };
