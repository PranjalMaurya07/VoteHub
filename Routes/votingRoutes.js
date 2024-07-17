const express = require('express');
const { vote, castVote } = require('../Controllers/controller');
const { auth } = require('../middlewares/auth');
const router = express.Router();

router.get('/',auth,vote);
router.post('/',auth,castVote);

module.exports = router;