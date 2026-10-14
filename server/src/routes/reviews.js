import { Router } from 'express';
import * as reviewController from "../controllers/reviewController.js";
import {getTopMeals} from "../controllers/reviewController.js";

const router = Router();
router.post('/', reviewController.createReview)
router.get('/', reviewController.getAllReviews)
router.get('/top', getTopMeals)
router.get('/:id', reviewController.getReview)
export default router;
