# Task 3.1 (Variant): Cafeteria Meal Review API

You are building the backend for a cafeteria meal review service, using Express and MongoDB (Mongoose) only, with no frontend. Anyone can browse and submit meal reviews, and there is no login for this resource.

## What's already done for you

- `server/src/index.js`, `server/src/app.js`, `server/src/config/db.js` —
  app bootstrap and DB connection. The `/api/reviews` router is already
  mounted in `app.js`.
- `server/src/models/User.js` — a plain user schema (`name`, `email`,
  `password`). It's not tied to any login flow here; it exists so
  `Review.reviewedBy` has something to reference.
- `server/src/controllers/userController.js` + `server/src/routes/users.js`
  — full CRUD over users, already wired, as a worked example of what your
  `reviewController.js` should look like structurally (validation → DB
  call → response, one function per route).

## Run locally

```
cd server
npm install
# create server/.env (see "Database connection" below)
npm run dev
```

## Database connection

There is no `.env` provided. Create `server/.env` yourself (it's
git-ignored) with:

```
PORT=3000
MONGO_URI=your connection string
```

## What you need to build

All of your work goes in three files: `server/src/models/Review.js`,
`server/src/controllers/reviewController.js` and
`server/src/routes/reviews.js`.

### 1. The `Review` model — `server/src/models/Review.js`

| field | type | rules |
|---|---|---|
| `mealCode` | String | required (e.g. `"ML101"`) |
| `rating` | Number | required, `min: 1`, `max: 5` |
| `comment` | String | optional |
| `reviewedBy` | ObjectId ref `User` | optional |

Keep `{ timestamps: true }` and add a **compound unique index** on
`{ mealCode: 1, reviewedBy: 1 }`.

### 2. Controller + routes

Implement these three controller functions and wire them in
`server/src/routes/reviews.js`:

| method | path | function | success response |
|---|---|---|---|
| POST | `/api/reviews` | `createReview` | `201` `{ review: <document> }` |
| GET | `/api/reviews` | `getAllReviews` | `200` `{ reviews: [...] }` |
| GET | `/api/reviews/:id` | `getReview` | `200` `{ review: <document> }` |

- For `GET /api/reviews/:id` on a valid id that does not exist, respond
  `404` with `{ message: 'Review not found' }`.
- Pass unexpected errors to `next(err)`, as the User controller does.

### 3. The top-rated meals endpoint

Implement `getTopMeals` and wire it as `GET /api/reviews/top?limit=3`. It
returns the `limit` meals with the highest average rating, ranked from
highest to lowest:

```
{
  "top": [
    { "mealCode": "ML101", "averageRating": 4.5, "reviewCount": 2 },
    { "mealCode": "ML202", "averageRating": 3,   "reviewCount": 1 }
  ]
}
```

- Compute it with `Review.aggregate()`: `$group` by `mealCode` with `$avg`
  of `rating` (as `averageRating`) and `$sum: 1` (as `reviewCount`), then
  `$sort` by `averageRating` descending, then `$limit`. Loading documents
  with `find()` and ranking them in JavaScript does not count.
- `limit` defaults to `5` when the query parameter is omitted.
- If `limit` is provided but is not a positive integer, respond `400` with
  `{ message: 'limit must be a positive integer' }`.
- If there are no reviews at all, return `{ "top": [] }`.
- `/top` must be reachable and must not be handled by `/:id`.

## Submission

1. Fork this repository and do all of your work in your fork.
2. Commit and push to your fork.
3. Open a pull request from your fork to `main` of this repository.
4. Fill in the pull request description using the provided template: the
   submission line must be your identifier in the format `XX-XXXXX TXX`.

## AI use

You're expected to use AI tools while building this. You remain
responsible for all of the code you submit.
