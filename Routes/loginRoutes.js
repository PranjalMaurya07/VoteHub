const express = require('express');
const { loginPage, loginVoter } = require('../Controllers/controller');
const router = express.Router();

router.get('/',loginPage);
router.post('/',loginVoter);

module.exports = router;