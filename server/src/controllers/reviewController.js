import mongoose from 'mongoose';
import { Review } from '../models/Review.js';

// GET /api/reviews
// Implemented per README.md section 2.
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find();
    res.status(200).json({ reviews });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/:id
// Implemented per README.md section 2.
export async function getReview(req, res, next) {
  try {
    const { id } = req.params;

    // Guard against invalid ObjectId strings before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ review });
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews
// Implemented per README.md section 2.
export async function createReview(req, res, next) {
  try {
    const { mealCode, rating, comment, reviewedBy } = req.body;

    const review = await Review.create({
      mealCode,
      rating,
      comment,
      reviewedBy: reviewedBy || undefined
    });

    res.status(201).json({ review });
  } catch (err) {
    // Handle duplicate key error (compound unique index violation)
    if (err.code === 11000) {
      return res.status(400).json({ message: 'User has already reviewed this meal' });
    }
    // Handle Mongoose schema validation errors (missing fields, rating out of bounds)
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
}

// GET /api/reviews/top?limit=3
// Implemented per README.md section 3.
export async function getTopMeals(req, res, next) {
  try {
    let limit = 5;

    if (req.query.limit !== undefined) {
      const parsed = Number(req.query.limit);

      if (!Number.isInteger(parsed) || parsed <= 0) {
        return res.status(400).json({ message: 'limit must be a positive integer' });
      }

      limit = parsed;
    }

    const top = await Review.aggregate([
      {
        $group: {
          _id: '$mealCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          mealCode: '$_id',
          averageRating: 1,
          reviewCount: 1
        }
      },
      {
        $sort: { averageRating: -1 }
      },
      {
        $limit: limit
      }
    ]);

    res.status(200).json({ top });
  } catch (err) {
    next(err);
  }
}