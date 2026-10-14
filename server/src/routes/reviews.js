import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getTopMeals,
} from '../controllers/reviewController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.
router.get('/api/reviews', getAllReviews);
router.get('/api/reviews/top', getTopMeals);
router.get('/api/reviews/:id', getReview);
router.post('/api/reviews', createReview);

export default router;
