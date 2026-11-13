
import mongoose from 'mongoose';
import { Review } from '../models/Review.js';

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find();
    return res.status(200).json({ reviews });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid review ID'
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }

    return res.status(200).json({ review });
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { mealCode, rating, comment, reviewedBy } = req.body;

    if (!mealCode || typeof mealCode !== 'string') {
      return res.status(400).json({
        message: 'mealCode is required'
      });
    }

    if (
      typeof rating !== 'number' ||
      !Number.isFinite(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: 'rating must be a number between 1 and 5'
      });
    }

    if (
      reviewedBy !== undefined &&
      reviewedBy !== null &&
      !mongoose.isValidObjectId(reviewedBy)
    ) {
      return res.status(400).json({
        message: 'Invalid reviewedBy ID'
      });
    }

    const review = await Review.create({
      mealCode,
      rating,
      comment,
      reviewedBy
    });

    return res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/top?limit=3
export async function getTopMeals(req, res, next) {
  try {
    const rawLimit = req.query.limit;
    let limit = 5;

    if (rawLimit !== undefined) {
      if (
        typeof rawLimit !== 'string' ||
        !/^[0-9]+$/.test(rawLimit) ||
        !Number.isSafeInteger(Number(rawLimit)) ||
        Number(rawLimit) <= 0
      ) {
        return res.status(400).json({
          message: 'limit must be a positive integer'
        });
      }

      limit = Number(rawLimit);
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
        $sort: {
          averageRating: -1,
          _id: 1
        }
      },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          mealCode: '$_id',
          averageRating: 1,
          reviewCount: 1
        }
      }
    ]);

    return res.status(200).json({ top });
  } catch (err) {
    next(err);
  }
}
