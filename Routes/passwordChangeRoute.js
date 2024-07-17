const express = require('express');
const { passwordChangePage, changePassword } = require('../Controllers/controller');
const { auth } = require('../middlewares/auth');
const router = express.Router();

router.get('/',auth,passwordChangePage);
router.post('/',auth,changePassword);

module.exports = router;