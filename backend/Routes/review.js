const express = require ('express')
const {getAllReviews, createReview} = require('../Controllers/reviewController.js');
const {authVarify, restrict} = require('../middlewares/authVarification.js');

const router = express.Router({mergeParams: true});

router.get("/", getAllReviews);
router.post("/",authVarify, restrict(['patient']), createReview);

module.exports = router;