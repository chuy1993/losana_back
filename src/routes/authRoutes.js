const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

const verifyFirebaseToken = require('../middlewares/firebaseAuth');

router.post('/login', verifyFirebaseToken, login);

module.exports = router;