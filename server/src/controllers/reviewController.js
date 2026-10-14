import { Review } from '../models/Review.js';

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;
const POSITIVE_INT_RE = /^[1-9]\d*$/;

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.status(200).json({ reviews });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/top?limit=3
export async function getTopMeals(req, res, next) {
  try {
    let limit = 5;
    if (req.query.limit !== undefined) {
      const raw = req.query.limit;
      if (typeof raw !== 'string' || !POSITIVE_INT_RE.test(raw)) {
        return res.status(400).json({ message: 'limit must be a positive integer' });
      }
      limit = Number(raw);
    }

    const top = await Review.aggregate([
      {
        $group: {
          _id: '$mealCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
      { $sort: { averageRating: -1, _id: 1 } },
      { $limit: limit },
      { $project: { _id: 0, mealCode: '$_id', averageRating: 1, reviewCount: 1 } },
    ]);

    return res.status(200).json({ top });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const { id } = req.params;
    if (!OBJECT_ID_RE.test(id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    return res.status(200).json({ review });
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { mealCode, rating, comment, reviewedBy } = req.body || {};

    if (typeof mealCode !== 'string' || mealCode.trim() === '') {
      return res.status(400).json({ message: 'mealCode is required' });
    }
    if (typeof rating !== 'number' || !Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'rating must be a number between 1 and 5' });
    }
    if (comment !== undefined && typeof comment !== 'string') {
      return res.status(400).json({ message: 'comment must be a string' });
    }
    if (reviewedBy !== undefined && (typeof reviewedBy !== 'string' || !OBJECT_ID_RE.test(reviewedBy))) {
      return res.status(400).json({ message: 'reviewedBy must be a valid id' });
    }

    const review = await Review.create({ mealCode, rating, comment, reviewedBy });
    return res.status(201).json({ review });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This user has already reviewed this meal' });
    }
    next(err);
  }
}