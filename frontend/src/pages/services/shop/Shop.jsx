import React, { useEffect, useState } from "react";
import api from "../../../utils/axiosConfig";
import { useAuth } from "../../../components/AuthContext";
import "./Shop.css";
import {loadRazorpay} from '../../../utils/loadRazorpay';

import SearchFilterBar from "./components/SearchFilterBar";
import Products from "./components/Products";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";

import { items } from "./components/shopData";

function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [pageMode, setPageMode] = useState("products");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const getUserAndCart = async () => {
      const userCart = await api.get("/shop/user-cart");
      setCartItems(userCart.data);
    };
    getUserAndCart();
  }, []);

  const handleAddToCart = async (id) => {
    try {
      const product = items.find((i) => i.id === id);
      if (!product) return;

      const res = await api.post(`/shop/${id}/add-to-cart`, {
        userId: user._id,
        item: {
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          img: product.img,
          category: product.category,
          quantity: 1,
        },
      });
      console.log(res.data.cart);
      setCartItems(res.data.cart);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const handleIncreaseQuantity = async (id) => {
    try {
      const res = await api.patch(`/shop/${id}/increase-qty`, {
        userId: user._id,
        itemId: id,
      });

      setCartItems(res.data.cart);
    } catch (err) {
      console.error("Increase qty error:", err);
    }
  };

  const handleDecreaseQuantity = async (id) => {
    try {
      const res = await api.patch(`/shop/${id}/decrease-qty`, {
        userId: user._id,
        itemId: id,
      });

      setCartItems(res.data.cart);
    } catch (err) {
      console.error("Decrease qty error:", err);
    }
  };

  const handleRemoveFromCart = async (id) => {
    try {
      const res = await api.post(`/shop/${id}/remove-from-cart`, {
        userId: user._id,
        itemId: id,
      });

      setCartItems(res.data.cart);
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  const handleCheckout = async () => {
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load");
      return;
    }
    const res = await api.post("/shop/create-rzp-order", {
      orderedBy: user._id,
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        description: item.description,
        category: item.category,
        img: item.img,
      })),
      shippingAddress: "Default Address",
    });

    const { razorpayOrder, order } = res.data;

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: "INR",
      name: "GreenSathi Shop",
      description: "Order Payment",
      order_id: razorpayOrder.id,

      handler: async (response) => {
        const verify = await api.post("/shop/verify-rzp-payment", {
          orderId: order._id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (verify.data.success) {
          alert("Payment successful!");
          await api.delete('/shop/empty-cart'); // empty user cart
          setCartItems([]);
          setPageMode("products");
        }
      },

      prefill: {
        name: user?.name,
        email: user?.email,
      },

      theme: {
        color: "#0a6847",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="shop-page">
      {/* 🔍 Search + Filters + Cart Button */}
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setPageMode={setPageMode}
        showMobileFilters={showMobileFilters}
        setShowMobileFilters={setShowMobileFilters}
        cartCount={cartItems.length || 0}
      />

      {/* 🛒 Products Page */}
      {pageMode === "products" && (
        <Products
          filteredItems={filteredItems}
          cartItems={cartItems}
          handleAddToCart={handleAddToCart}
          setSelectedProduct={setSelectedProduct}
          setPageMode={setPageMode}
        />
      )}

      {/* 📄 Product Detail */}
      {pageMode === "details" && selectedProduct && (
        <ProductDetail
          selectedProduct={selectedProduct}
          cartItems={cartItems}
          setPageMode={setPageMode}
          handleAddToCart={handleAddToCart}
        />
      )}

      {/* 🛍️ Cart */}
      {pageMode === "cart" && (
        <Cart
          user={user}
          cartItems={cartItems}
          handleIncreaseQuantity={handleIncreaseQuantity}
          handleDecreaseQuantity={handleDecreaseQuantity}
          handleRemoveFromCart={handleRemoveFromCart}
          setPageMode={setPageMode}
        />
      )}

      {/* 💳 Checkout */}
      {pageMode === "checkout" && (
        <Checkout cartItems={cartItems} setPageMode={setPageMode} handleCheckout={handleCheckout}/>
      )}

      {/* FOOTER stays same */}
      <div className="shop-footer">
        <div className="footer-card">
          <div className="footer-grid">
            <div className="footer-item">
              <div className="footer-icon">🚚</div>
              <h3 className="footer-title">Free Shipping</h3>
              <p className="footer-text">On orders over ₹500</p>
            </div>
            <div className="footer-item">
              <div className="footer-icon">♻️</div>
              <h3 className="footer-title">Eco-Friendly</h3>
              <p className="footer-text">Sustainable products only</p>
            </div>
            <div className="footer-item">
              <div className="footer-icon">💚</div>
              <h3 className="footer-title">Community Impact</h3>
              <p className="footer-text">Supporting local initiatives</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
