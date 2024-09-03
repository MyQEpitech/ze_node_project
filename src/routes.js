const express = require('express');
const { register } = require('./userController');
const { registerformRules } = require('./validationConfig')
const router = express.Router();

router.get('/', (req, res) => res.send("Hello world"));
router.post('/register', registerformRules, register);

module.exports = router;