const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const shopController = require('../controllers/shop.controller.js');

router.get('/', wrapAsync(shopController.getAllItems));
router.get('/user-cart', wrapAsync(shopController.getUserCart));
router.delete('/empty-cart', wrapAsync(shopController.emptyUserCart));
// helper route to create rzp order with details for demonstrating a working model
router.post('/create-rzp-order', wrapAsync(shopController.createRazorpayOrder));
router.post('/verify-rzp-payment', wrapAsync(shopController.verifyRazorpayOrder));
router.get('/:id', wrapAsync(shopController.getSpecificItem));
router.post('/:id/add-to-cart', wrapAsync(shopController.addItemToCart));
router.post('/:id/remove-from-cart', wrapAsync(shopController.removeItemFromCart));
router.patch('/:id/increase-qty', wrapAsync(shopController.increaseItemQty));
router.patch('/:id/decrease-qty', wrapAsync(shopController.decreaseItemQty));
router.post('/place-order', wrapAsync(shopController.placeOrder));

module.exports = router;