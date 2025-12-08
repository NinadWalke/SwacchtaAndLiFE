const express = require('express');
const router = express.Router();
const recycleController = require('../controllers/recycle.controller');
const wrapASync = require('../utils/wrapAsync');

router.get('/franchisees', wrapASync(recycleController.getAllFranchisees));

// User: create a recycle request to a specific franchisee
router.post('/create', wrapASync(recycleController.createRecycleRequest));

// User: get own recycle requests
router.get('/my-requests', wrapASync(recycleController.getMySubmissions));

// Public/User: get waste types
router.get('/types', wrapASync(recycleController.getWasteTypes));

// Franchisee admin: get requests for their franchisee
router.get('/franchisee/requests', wrapASync(recycleController.getFranchiseeRequests));

// Franchisee admin: approve a request
router.patch('/franchisee/requests/:id/approve', wrapASync(recycleController.approveSubmission));

// Franchisee admin: reject a request
router.patch('/franchisee/requests/:id/reject', wrapASync(recycleController.rejectSubmission));

module.exports = router;
