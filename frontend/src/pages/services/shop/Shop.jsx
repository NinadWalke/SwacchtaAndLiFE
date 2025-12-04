import React, { useState } from "react";
import api from "../../../utils/axiosConfig";
import { useAuth } from "../../../components/AuthContext";
import "./Shop.css";

import { items, categories } from "./components/shopData";

function Shop() {
  const [addedItems, setAddedItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [pageMode, setPageMode] = useState("products"); // "products" | "details" | "cart" | "checkout"
  const [selectedProduct, setSelectedProduct] = useState(null); // object for details view
  const [cartItems, setCartItems] = useState([]); // array of products added to cart
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { user } = useAuth();

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
      setCartItems(res.data.cart);

      setAddedItems((prev) => new Set([...prev, id]));
      setTimeout(() => {
        setAddedItems((prev) => {
          const copy = new Set(prev);
          copy.delete(id);
          return copy;
        });
      }, 2000);
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
      <div className="shop-header">
        <div className="shop-header-content">
          <div className="search-filter-bar">
            {/* 1. Search Input */}
            <div className="search-wrapper">
              <span className="search-icon">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {/* 2. Categories (Responsive Wrapper) */}
            <div className="filters-wrapper">
              <button
                className="mobile-filter-toggle"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <i className="fa-solid fa-sliders"></i>
              </button>
              <div
                className={`category-filters ${
                  showMobileFilters ? "show-dropdown" : ""
                }`}
              >
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setPageMode("products");
                      setShowMobileFilters(false);
                    }}
                    className={`category-btn ${
                      selectedCategory === cat.id ? "active" : ""
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Cart Button (Moved Here) */}
            <div className="cart-button" onClick={() => setPageMode("cart")}>
              <span className="cart-icon">
                <i className="fa-solid fa-cart-shopping"></i>
              </span>
              <span className="cart-text">Cart ({user?.cart.length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid wrapped in condition */}
      {pageMode === "products" && (
        <div className="products-section">
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <p>No products found matching your criteria</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="product-card"
                  onClick={() => {
                    setSelectedProduct(item);
                    setPageMode("details");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="product-image-wrapper">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="product-image"
                    />
                    <div className="product-price-badge">₹ {item.price}</div>
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{item.name}</h3>
                    <p className="product-description">{item.description}</p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item.id);
                      }}
                      disabled={addedItems.has(item.id)}
                      className={`add-to-cart-btn ${
                        addedItems.has(item.id) ? "added" : ""
                      }`}
                    >
                      {addedItems.has(item.id) ? (
                        <>
                          <span className="btn-icon">✓</span>
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <span className="btn-icon">
                            <i className="fa-solid fa-cart-shopping"></i>
                          </span>
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Details Page */}
      {pageMode === "details" && selectedProduct && (
        <div className="details-page">
          {/* Back Button (Absolute Position) */}
          <button
            className="back-button"
            onClick={() => setPageMode("products")}
          >
            <span className="back-icon">
              <i className="fa-solid fa-arrow-left"></i>
            </span>
          </button>

          {/* Image Section (Left) */}
          <div className="image-container">
            <img
              src={selectedProduct.img}
              alt={selectedProduct.name}
              className="details-image"
            />
          </div>

          {/* Text Content Section (Right) */}
          <div className="details-content">
            <div>
              <h2 className="details-name">{selectedProduct.name}</h2>
              <p className="details-description">
                {selectedProduct.description}
              </p>
              <p className="details-price">₹ {selectedProduct.price}</p>
            </div>

            <button
              className="add-to-cart-btn"
              onClick={() => handleAddToCart(selectedProduct.id)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

      {pageMode === "cart" && ( //Cart page
        <div className="cart-page">
          <button
            className="back-button"
            onClick={() => setPageMode("products")}
          >
            <span className="back-icon">
              <i className="fa-solid fa-arrow-left"></i>
            </span>
          </button>

          <h2 className="cart-title">Your Cart</h2>

          {user?.cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <div className="cart-list">
              {user?.cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>
                      {item.price} x {item.quantity}
                    </p>

                    {/* Quantity Controls */}
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleDecreaseQuantity(item.id)}
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(item.id)}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {user?.cart.length > 0 && (
            <button
              className="checkout-btn"
              onClick={() => setPageMode("checkout")}
            >
              Proceed to Checkout
            </button>
          )}
        </div>
      )}

      {pageMode === "checkout" && (
        <div className="checkout-page">
          <button className="back-button" onClick={() => setPageMode("cart")}>
            <span className="back-icon">
              <i className="fa-solid fa-arrow-left"></i>
            </span>{" "}
            Back to Cart
          </button>

          <h2>Checkout</h2>

          {cartItems.length === 0 ? (
            <div className="empty-cart-message">Your cart is empty.</div>
          ) : (
            <>
              <ul className="checkout-list">
                {cartItems.map((item, index) => (
                  <li key={index} className="checkout-item">
                    <div className="checkout-item-left">
                      <img
                        src={item.product.img}
                        alt={item.product.name}
                        className="checkout-item-img"
                      />
                      <div className="checkout-item-info">
                        <span className="checkout-item-name">
                          {item.product.name}
                        </span>
                        <span className="checkout-item-qty">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="checkout-item-price">
                      <i className="fa-solid fa-indian-rupee-sign"></i>{" "}
                      {item.product.price}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="checkout-summary">
                <div className="checkout-total">
                  Total: <i className="fa-solid fa-indian-rupee-sign"></i>
                  {cartItems
                    .reduce((sum, item) => {
                      return sum + item.product.price * item.quantity;
                    }, 0)
                    .toLocaleString("en-IN")}{" "}
                </div>

                <button className="pay-btn">Pay Now</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="shop-footer">
        <div className="footer-card">
          <div className="footer-grid">
            <div className="footer-item">
              <div className="footer-icon">🚚</div>
              <h3 className="footer-title">Free Shipping</h3>
              <p className="footer-text">
                On orders over <i className="fa-solid fa-indian-rupee-sign"></i>
                500
              </p>
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
