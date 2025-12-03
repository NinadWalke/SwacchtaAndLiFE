import React, { useState } from 'react';
import './Shop.css';

function Shop() {
  const [addedItems, setAddedItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pageMode, setPageMode] = useState("products");   // "products" | "details" | "cart" | "checkout"
  const [selectedProduct, setSelectedProduct] = useState(null); // object for details view
  const [cartItems, setCartItems] = useState([]); // array of products added to cart
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const items = [
    { id: 1, name: "Compost Bin", price: "₹2,000", description: "Eco-friendly compost bin.", img: "/assets/compost_bin.png", category: "collection" },
    { id: 2, name: "Recycling Bags", price: "₹250", description: "Reusable recycling bags.", img: "/assets/recycle_bins.png", category: "collection" },
    { id: 3, name: "Gloves", price: "₹350", description: "Durable gloves for cleanups.", img: "/assets/gloves.png", category: "safety" },
    { id: 4, name: "Trash Picker", price: "₹1,200", description: "Ergonomic trash picker.", img: "/assets/trash_collector.png", category: "collection" },
    { id: 5, name: "Recyclable Bin", price: "₹2,400", description: "Separate bin for recyclables.", img: "/assets/recyclable_bins.png", category: "collection" },
    { id: 6, name: "Safety Vest", price: "₹960", description: "Reflective safety vest.", img: "/assets/vests.png", category: "safety" },
    { id: 7, name: "Face Mask", price: "₹349", description: "Breathable face mask.", img: "/assets/masks.png", category: "hygiene" },
    { id: 8, name: "Hand Sanitizer", price: "₹100", description: "Portable hand sanitizer.", img: "/assets/sanitiser.png", category: "hygiene" },
    { id: 9, name: "Water Bottle", price: "₹100", description: "Reusable water bottle.", img: "/assets/bottle.png", category: "essentials" },
    { id: 10, name: "Eco Bag", price: "₹560", description: "Reusable shopping bag.", img: "/assets/bags.png", category: "essentials" },
  ];

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'collection', label: 'Collection Tools' },
    { id: 'safety', label: 'Safety Gear' },
    { id: 'hygiene', label: 'Hygiene' },
    { id: 'essentials', label: 'Essentials' }
  ];

  const handleAddToCart = (id) => {
  const product = items.find(i => i.id === id);
  if (!product) return;

  setCartItems(prev => {
    const existingIndex = prev.findIndex(item => item.product.id === id);
    if (existingIndex !== -1) {
      // Item already in cart, increment quantity
      const updated = [...prev];
      updated[existingIndex].quantity += 1;
      return updated;
    } else {
      // Add new item with quantity 1
      return [...prev, { product, quantity: 1 }];
    }
  });
  
  // optional: temporary "added" state
  setAddedItems(prev => new Set([...prev, id]));
  setTimeout(() => {
    setAddedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, 2000);
};

  // Place this just after handleAddToCart function

  const handleIncreaseQuantity = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (id) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.product.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0) // remove item if quantity reaches 0
    );
  };

  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.product.id !== id));
  };



  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

return (
  <div className="shop-page">
    {/* Header Section */}
    <div className="shop-header">
    <div className="shop-header-content">
      
      {/* Note: .header-top removed as requested since Cart moved and Title was commented out */}

      {/* Search, Filter, and Cart Bar */}
      <div className="search-filter-bar">
        
        {/* 1. Search Input */}
        <div className="search-wrapper">
          <span className="search-icon"><i className="fa-solid fa-magnifying-glass"></i></span>
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
            {/* Mobile Toggle Button */}
            <button 
                className="mobile-filter-toggle"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
                <i className="fa-solid fa-sliders"></i>
            </button>

            {/* Category List (Dropdown on mobile, Row on desktop) */}
            <div className={`category-filters ${showMobileFilters ? 'show-dropdown' : ''}`}>
            {categories.map(cat => (
                <button
                key={cat.id}
                onClick={() => {
                    setSelectedCategory(cat.id);
                    setPageMode("products");
                    setShowMobileFilters(false); // Close dropdown on selection
                }}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                >
                {cat.label}
                </button>
            ))}
            </div>
        </div>

        {/* 3. Cart Button (Moved Here) */}
        <div className="cart-button" onClick={() => setPageMode("cart")}>
          <span className="cart-icon"><i className="fa-solid fa-cart-shopping"></i></span>
          <span className="cart-text">Cart ({cartItems.length})</span>
        </div>

      </div>
    </div>
  </div>

    {/* CHANGE #1 — Product Grid wrapped in condition */}
      {pageMode === "products" && (
        <div className="products-section">
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <p>No products found matching your criteria</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="product-card"
                  onClick={() => { setSelectedProduct(item); setPageMode("details"); }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="product-image-wrapper">
                    <img src={item.img} alt={item.name} className="product-image" />
                    <div className="product-price-badge">{item.price}</div>
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{item.name}</h3>
                    <p className="product-description">{item.description}</p>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(item.id); }}
                      disabled={addedItems.has(item.id)}
                      className={`add-to-cart-btn ${addedItems.has(item.id) ? 'added' : ''}`}
                    >
                      {addedItems.has(item.id) ? (
                        <>
                          <span className="btn-icon">✓</span>
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <span className="btn-icon"><i class="fa-solid fa-cart-shopping"></i></span>
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

    {/* CHANGE #3 — Details Page */}
          {pageMode === "details" && selectedProduct && (
  <div className="details-page">
    {/* Back Button (Absolute Position) */}
    <button className="back-button" onClick={() => setPageMode("products")}>
      <span className="back-icon"><i className="fa-solid fa-arrow-left"></i></span>
    </button>

    {/* Image Section (Left) */}
    <div className="image-container">
        <img src={selectedProduct.img} alt={selectedProduct.name} className="details-image" />
    </div>

    {/* Text Content Section (Right) */}
    <div className="details-content">
      <div>
      <h2 className="details-name">{selectedProduct.name}</h2>
      <p className="details-description">{selectedProduct.description}</p>
      <p className="details-price">{selectedProduct.price}</p>
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

      <button className="back-button" onClick={() => setPageMode("products")}>
        <span className="back-icon"><i class="fa-solid fa-arrow-left"></i></span>
      </button>


      <h2 className="cart-title">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <div className="cart-list">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.product.img} alt={item.product.name} className="cart-item-image" />
              <div className="cart-item-info">
                <h3>{item.product.name}</h3>
                <p>{item.product.price} x {item.quantity}</p>

          {/* Quantity Controls */}
            <div className="quantity-controls">
              <button onClick={() => handleDecreaseQuantity(item.product.id)}><i class="fa-solid fa-minus"></i></button>
              <span>{item.quantity}</span>
              <button onClick={() => handleIncreaseQuantity(item.product.id)}><i class="fa-solid fa-plus"></i></button>
              <button 
                className="remove-btn" 
                onClick={() => handleRemoveFromCart(item.product.id)}
              >
              <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>

              </div>
            </div>
          ))}
        </div>
      )}

    {cartItems.length > 0 && (
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
      <span className="back-icon"><i className="fa-solid fa-arrow-left"></i></span> Back to Cart
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
                <img src={item.product.img} alt={item.product.name} className="checkout-item-img" />
                <div className="checkout-item-info">
                    <span className="checkout-item-name">{item.product.name}</span>
                    <span className="checkout-item-qty">Qty: {item.quantity}</span>
                </div>
              </div>
              <span className="checkout-item-price">{item.product.price}</span>
            </li>
          ))}
        </ul>

        <div className="checkout-summary">
            <div className="checkout-total">
            Total: <i className="fa-solid fa-indian-rupee-sign"></i> 
            {cartItems.reduce((sum, item) => {
                // Fix: Removes commas and currency symbols before parsing
                const numericPrice = parseFloat(item.product.price.replace(/[^0-9.]/g, "")); 
                return sum + (numericPrice * item.quantity);
            }, 0).toLocaleString('en-IN')} {/* Adds commas back to the total */}
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
              <p className="footer-text">On orders over <i class="fa-solid fa-indian-rupee-sign"></i>500</p>
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