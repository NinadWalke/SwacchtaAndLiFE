const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ospController = require('../controllers/osp.controller');

// GET -> /osp/active
router.get("/active", wrapAsync(ospController.getActiveOsps));

// POST -> /osp/toggle-duty
router.post("/toggle-duty", wrapAsync(ospController.toggleDuty));

module.exports = router;
