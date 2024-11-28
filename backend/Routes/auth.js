const express = require ('express')

const { register, login, changePassword } = require ('../Controllers/authControllers.js');
const { authVarify } = require('../middlewares/authVarification.js');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/changePass', authVarify, changePassword);

module.exports = router;