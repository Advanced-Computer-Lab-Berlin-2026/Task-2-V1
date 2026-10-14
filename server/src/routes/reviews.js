import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
} from '../controllers/reviewController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.
router.get('/', getAllReviews);
router.get('/:id', getReview);
router.post('/', createReview);

export default router;
