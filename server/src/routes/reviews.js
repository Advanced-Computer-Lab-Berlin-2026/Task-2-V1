import { Router } from 'express';
import {
  getAllReviews,
  getTopMeals,
  getReview,
  createReview
} from '../controllers/reviewController.js';

const router = Router();

// GET /api/reviews
router.get('/', getAllReviews);

// GET /api/reviews/top (placed before /:id so Express routes /top correctly)
router.get('/top', getTopMeals);

// GET /api/reviews/:id
router.get('/:id', getReview);

// POST /api/reviews
router.post('/', createReview);

export default router;