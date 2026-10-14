import { Review } from '../models/Review.js';

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const {id} = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (err) { next(err); }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) { next(err); }
}

//GET api/reviews/top?limit=3
export async function getTopMeals(req, res, next) {
  try {
    const rawLimit = req.query.limit;
    const limit = rawLimit === undefined ? 5 : Number(rawLimit);

    if (
      rawLimit !== undefined &&
      (typeof rawLimit !== 'string' ||
        !/^\d+$/.test(rawLimit) ||
        !Number.isSafeInteger(limit) ||
        limit <= 0)
    ) {
      return res.status(400).json({ message: 'limit must be a positive integer' });
    }

    const top = await Review.aggregate([
      {
        $group: {
          _id: '$mealCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
      { $sort: { averageRating: -1 } },
      { $limit: limit },
    ]);

    res.json({
      top: top.map(({ _id, averageRating, reviewCount }) => ({
        mealCode: _id,
        averageRating,
        reviewCount,
      })),
    });
  } catch (err) {
    next(err);
  }
}
