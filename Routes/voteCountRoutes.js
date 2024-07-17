const express = require('express');
const { voteCount, countVote } = require('../Controllers/controller');
const router = express.Router();

router.get('/',voteCount);
router.post('/',countVote);

module.exports = router;