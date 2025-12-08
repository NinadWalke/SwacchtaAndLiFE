const express = require('express');
const router = express.Router();
const recycleController = require('../controllers/recycle.controller');

router.post('/create', recycleController.createRecycleRequest);

module.exports = router;