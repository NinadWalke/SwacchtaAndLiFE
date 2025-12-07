const express = require("express");
const router = express.Router();
const trainingController = require("../controllers/training.controller");

router.post('/quiz', trainingController.recordQuizPoints)

module.exports = router;