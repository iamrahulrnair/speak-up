import express, { Request, Response } from 'express';

import { Review } from '../models/review';
import { REVIEW_URL } from '../common/variable';
import { requireAuth } from '@suup/common';

const router = express.Router();

// @TODO: requireAuth'
// @TODO: No use cus this route is for audit purposes

router.get(REVIEW_URL, requireAuth, async (req: Request, res: Response) => {
  const reviews = await Review.find().select('-reviews');
  res.status(200).send(reviews);
});
export { router as getAllReviewRouter };
