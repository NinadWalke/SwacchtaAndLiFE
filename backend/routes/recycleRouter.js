const express = require('express');
const router = express.Router();
const recycleController = require('../controllers/recycle.controller');

// User: create a recycle request to a specific franchisee
router.post('/create', recycleController.createRecycleRequest);

// User: get own recycle requests
router.get('/my-requests', recycleController.getMySubmissions);

// Public/User: get waste types
router.get('/types', recycleController.getWasteTypes);

// Franchisee admin: get requests for their franchisee
router.get('/franchisee/requests', recycleController.getFranchiseeRequests);

// Franchisee admin: approve a request
router.patch('/franchisee/requests/:id/approve', recycleController.approveSubmission);

// Franchisee admin: reject a request
router.patch('/franchisee/requests/:id/reject', recycleController.rejectSubmission);

module.exports = router;
