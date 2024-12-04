const express = require ('express')
const {updateUser, deleteUser, getSingleUser, getAllUser, getUserProfile, getMyAppointments} = require('../Controllers/userController');
const {authVarify, restrict} = require('../middlewares/authVarification.js');

const router = express.Router();

router.get("/:id", authVarify, restrict(['patient']), getSingleUser);
router.get("/", authVarify, restrict(['admin']), getAllUser);
router.put("/:id", authVarify, restrict(['patient']), updateUser);
router.delete("/:id", authVarify, restrict(['patient']), deleteUser);
router.get("/profile/me", authVarify, restrict(['patient']), getUserProfile);
router.get("/appointments/my-appointments", authVarify, restrict(['patient']), getMyAppointments);

module.exports = router;