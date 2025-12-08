const express = require("express");
const router = express.Router();
const officialController = require("../controllers/official.controller");

// Admin/Official: Create franchisee
router.post("/franchisee/create", officialController.createFranchisee);

module.exports = router;
