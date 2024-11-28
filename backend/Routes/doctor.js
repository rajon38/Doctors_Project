const express = require ('express')
const {updateDoctor, deleteDoctor, getSingleDoctor, getAllDoctor} = require('../Controllers/doctorController.js');
const {authVarify, restrict} = require('../middlewares/authVarification.js');

const reviewRouter = require('./review.js')

const router = express.Router();


//nested route
router.use("/:doctorId/reviews", reviewRouter)
//

router.get("/:id", getSingleDoctor);
router.get("/", getAllDoctor);
router.put("/:id", authVarify, restrict(['doctor']),updateDoctor);
router.delete("/:id",authVarify, restrict(['doctor']), deleteDoctor);

module.exports = router;