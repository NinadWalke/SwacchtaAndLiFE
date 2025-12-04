const User = require("../schemas/User.js");
const Order = require("../schemas/Order.js");
const crypto = require("crypto");
const Razorpay = require("razorpay");

exports.getAllItems = async (req, res) => {};
exports.getSpecificItem = async (req, res) => {};

exports.addItemToCart = async (req, res) => {
  const { userId, item } = req.body;

  const user = await User.findById(userId);

  // Check if item exists
  const existingItem = user.cart.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += item.quantity || 1;
  } else {
    user.cart.push(item);
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Item added to cart",
    cart: user.cart,
  });
};

exports.getUserCart = async(req, res) => {
  const userId = req.user._id;
  const userWithCart = await User.findById(userId).populate("cart");
  res.json(userWithCart.cart);
}

exports.emptyUserCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }
  user.cart = [];
  await user.save();
  res.status(200).json({
    success: true,
    message: "Cart emptied successfully",
    cart: user.cart
  });
}

exports.removeItemFromCart = async (req, res) => {
  const { userId, itemId } = req.body;

  const user = await User.findById(userId);

  user.cart = user.cart.filter((item) => item.id !== itemId);

  await user.save();

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    cart: user.cart,
  });
};

exports.increaseItemQty = async (req, res) => {
  const { userId, itemId } = req.body;

  const user = await User.findById(userId);

  const item = user.cart.find((i) => i.id === itemId);

  if (!item) {
    return res
      .status(400)
      .json({ success: false, message: "Item not found in cart" });
  }

  item.quantity += 1;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Item quantity increased",
    cart: user.cart,
  });
};

exports.decreaseItemQty = async (req, res) => {
  const { userId, itemId } = req.body;

  const user = await User.findById(userId);

  const item = user.cart.find((i) => i.id === itemId);

  if (!item) {
    return res
      .status(400)
      .json({ success: false, message: "Item not found in cart" });
  }

  item.quantity -= 1;

  // Remove if qty hits 0
  if (item.quantity <= 0) {
    user.cart = user.cart.filter((i) => i.id !== itemId);
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Item quantity decreased",
    cart: user.cart,
  });
};

exports.placeOrder = async (req, res) => {
  const { items, orderedBy, shippingAddress, paymentMethod = "cod" } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Items are required",
    });
  }

  if (!orderedBy) {
    return res.status(400).json({
      success: false,
      message: "orderedBy (userId) is required",
    });
  }

  let totalAmount = 0;
  items.forEach((item) => {
    totalAmount += item.price * item.quantity;
  });

  const newOrder = await Order.create({
    items,
    orderedBy,
    totalAmount,
    orderStatus: paymentMethod === "cod" ? "processing" : "created",
    paymentStatus: "pending",
    paymentMethod,
    shippingAddress,
  });

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order: newOrder,
  });
};

// helper route to create rzp order with details for demonstrating a working model
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { items, orderedBy, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Items are required" });
    }

    if (!orderedBy) {
      return res
        .status(400)
        .json({ success: false, message: "orderedBy (userId) is required" });
    }

    let totalAmount = 0;
    items.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const rzpOrder = await razorpay.orders.create(options);

    const newOrder = await Order.create({
      items,
      orderedBy,
      totalAmount,
      orderStatus: "created",
      paymentStatus: "pending",
      razorpayOrderId: rzpOrder.id,
      shippingAddress: shippingAddress || "",
    });

    return res.status(200).json({
      success: true,
      razorpayOrder: rzpOrder,
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};


exports.verifyRazorpayOrder = async (req, res) => {
  const {
    orderId,               
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Missing payment fields"
    });
  }
  
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  // 3️⃣ VERIFY SIGNATURE MATCH
  const isValid = generatedSignature === razorpay_signature;

  if (!isValid) {
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "failed",
      orderStatus: "failed",
    });

    return res.status(400).json({
      success: false,
      message: "Payment verification failed"
    });
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      paymentStatus: "paid",
      orderStatus: "paid",
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    order: updatedOrder,
  });
};