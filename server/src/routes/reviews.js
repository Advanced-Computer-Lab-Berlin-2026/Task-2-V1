import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getTopMeals,
} from '../controllers/reviewController.js';

const router = Router();

router.get('/', getAllReviews);
router.post('/', createReview);
router.get('/top', getTopMeals); // must stay BEFORE '/:id'
router.get('/:id', getReview);

export default router;