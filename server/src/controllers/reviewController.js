import { Review } from '../models/Review.js';
import reviews from "../routes/reviews.js";

// GET /api/reviews
// TODO: implement per README.md section 2.
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find(undefined, undefined, undefined);
    res.status(200).json(reviews);
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
// TODO: implement per README.md section 2.
export async function getReview(req, res, next) {
  try {
    const {id} = req.params;
    const review = await Review.findById(id, null, null);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    return res.status(200).json(review);
  } catch (err) { next(err); }
}

// POST /api/reviews
// TODO: implement per README.md section 2.
export async function createReview(req, res, next) {
  try {
    const reviews = await Review.create(req.body, null);
    return res.status(201).json(reviews);
  } catch (err) { next(err); }
}
// GET /api/reviews/summary?mealCode=ML101
// TODO: implement per README.md section 3
export async function getTopMeals(req, res, next){
  try {
    let limit = 5; // Default limit

    if (req.query.limit !== undefined) {
      // Parse the limit parameter
      limit = Number(req.query.limit);

      // Validate that it's a positive integer (whole number > 0)
      if (!Number.isInteger(limit) || limit <= 0) {
        return res.status(400).json({ message: 'limit must be a positive integer' });
      }
    }

    const topMeals = await Review.aggregate([
      {
        $group: {
          _id: '$mealCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      },
      {
        $sort: { averageRating: -1 }
      },
      {
        $limit: limit
      },
      {
        $project: {
          _id: 0,
          mealCode: '$_id',
          averageRating: 1,
          reviewCount: 1
        }
      }
    ]);

    return res.status(200).json({ top: topMeals });
  } catch (err) {
    next(err);
  }
}

/*module.exports = {
  getReview,
  createReview,
  getAllReviews,
  getTopMeals
};*/