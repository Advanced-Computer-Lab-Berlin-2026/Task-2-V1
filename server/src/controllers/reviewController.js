import { Review } from '../models/Review.js';

// GET /api/reviews
// TODO: implement per README.md section 2.
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find();
    res.status(200).json({ reviews });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/:id
// TODO: implement per README.md section 2.
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ review });
  } catch (err) {
    next(err);
  }
}


// POST /api/reviews
// TODO: implement per README.md section 2.
export async function createReview(req, res, next) {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/summary?mealCode=ML101
// TODO: implement per README.md section 3.

export async function getTopMeals(req, res, next) {
  try {
    let limit = 5;

    const raw = req.query.limit;
    if (raw !== undefined) {
      if (typeof raw !== 'string' || !/^[1-9]\d*$/.test(raw)) {
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

    res.status(200).json({ top });
  } catch (err) {
    next(err);
  }
}
