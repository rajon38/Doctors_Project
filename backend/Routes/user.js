const express = require ('express')
const {updateUser, deleteUser, getSingleUser, getAllUser} = require('../Controllers/userController');
const {authVarify, restrict} = require('../middlewares/authVarification.js');

const router = express.Router();

router.get("/:id", authVarify, restrict(['patient']), getSingleUser);
router.get("/", authVarify, restrict(['admin']), getAllUser);
router.put("/:id", authVarify, restrict(['patient']), updateUser);
router.delete("/:id", authVarify, restrict(['patient']), deleteUser);

module.exports = router;