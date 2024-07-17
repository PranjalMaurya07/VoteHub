const express = require('express');
const { logout } = require('../Controllers/controller');
const { auth } = require('../middlewares/auth');
const router = express.Router();

router.get('/',auth,logout);

module.exports = router;