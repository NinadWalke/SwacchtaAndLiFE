const express = require('express');
const router = express.Router();
const recycleController = require('../controllers/recycle.controller');
const wrapASync = require('../utils/wrapAsync');

// Franchisee listing
router.get('/franchisees', wrapASync(recycleController.getAllFranchisees));
router.get('/franchisees/near-me', wrapASync(recycleController.getNearbyFranchisees));

// Create recycle request
router.post('/create', wrapASync(recycleController.createRecycleRequest));

// User's own submissions
router.get('/my-requests', wrapASync(recycleController.getMySubmissions));

// Waste type public fetching
router.get('/types', wrapASync(recycleController.getWasteTypes));

// Admin: CRUD on waste types
router.post('/types', wrapASync(recycleController.createWasteType));
router.patch('/types/:id', wrapASync(recycleController.updateWasteType));
router.delete('/types/:id', wrapASync(recycleController.deleteWasteType));

// Franchisee waste types selection
router.get('/franchisee/waste-types', wrapASync(recycleController.getFranchiseeWasteTypes));
router.post('/franchisee/waste-types', wrapASync(recycleController.updateFranchiseeWasteTypes));

// Franchisee managing requests 
router.get('/franchisee/requests', wrapASync(recycleController.getFranchiseeRequests));
router.patch('/franchisee/requests/:id/assign-vendor', wrapASync(recycleController.assignVendor));
router.patch('/franchisee/requests/:id/approve', wrapASync(recycleController.approveSubmission));
router.patch('/franchisee/requests/:id/reject', wrapASync(recycleController.rejectSubmission));

module.exports = router;
    