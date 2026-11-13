
import { Router } from 'express';

import {
  getAllReviews,
  getReview,
  createReview,
  getTopMeals
} from '../controllers/reviewController.js';

const router = Router();

// Get the highest-rated meals
router.get('/top', getTopMeals);

// Get all reviews
router.get('/', getAllReviews);

// Get one review by ID
router.get('/:id', getReview);

// Create a new review
router.post('/', createReview);

export default router;
