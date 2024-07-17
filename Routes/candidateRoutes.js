const express = require('express');
const { candidatePage, addCandidates } = require('../Controllers/controller');
const { auth } = require('../middlewares/auth');
const router = express.Router();

router.get('/',auth,candidatePage);
router.post('/',auth,addCandidates);

module.exports = router;