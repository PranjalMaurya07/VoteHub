const express = require('express');
const { registerVoter, registrationPage } = require('../Controllers/controller');
const router = express.Router();

router.get('/',registrationPage);
router.post('/',registerVoter);


module.exports = router;