import React, { useState } from 'react';
import './Shop.css';

function Shop() {
  const [addedItems, setAddedItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const items = [
    { id: 1, name: "Compost Bin", price: "$25", description: "Eco-friendly compost bin.", img: "/assets/box.png", category: "collection" },
    { id: 2, name: "Recycling Bags", price: "$10", description: "Reusable recycling bags.", img: "/assets/box.png", category: "collection" },
    { id: 3, name: "Gloves", price: "$5", description: "Durable gloves for cleanups.", img: "/assets/box.png", category: "safety" },
    { id: 4, name: "Trash Picker", price: "$15", description: "Ergonomic trash picker.", img: "/assets/box.png", category: "collection" },
    { id: 5, name: "Recyclable Bin", price: "$30", description: "Separate bin for recyclables.", img: "/assets/box.png", category: "collection" },
    { id: 6, name: "Safety Vest", price: "$12", description: "Reflective safety vest.", img: "/assets/box.png", category: "safety" },
    { id: 7, name: "Face Mask", price: "$8", description: "Breathable face mask.", img: "/assets/box.png", category: "hygiene" },
    { id: 8, name: "Hand Sanitizer", price: "$4", description: "Portable hand sanitizer.", img: "/assets/box.png", category: "hygiene" },
    { id: 9, name: "Water Bottle", price: "$10", description: "Reusable water bottle.", img: "/assets/box.png", category: "essentials" },
    { id: 10, name: "Eco Bag", price: "$7", description: "Reusable shopping bag.", img: "/assets/box.png", category: "essentials" },
  ];

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'collection', label: 'Collection Tools' },
    { id: 'safety', label: 'Safety Gear' },
    { id: 'hygiene', label: 'Hygiene' },
    { id: 'essentials', label: 'Essentials' }
  ];

  const handleAddToCart = (id) => {
    setAddedItems(prev => new Set([...prev, id]));
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 2000);
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
          <div className="header-top">
            <div className="header-text">
              <h1 className="shop-title">Eco Shop</h1>
              <p className="shop-subtitle">Essential tools for waste collection and hygiene</p>
            </div>
            <div className="cart-button">
              <span className="cart-icon">🛒</span>
              <span className="cart-text">Cart</span>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="search-filter-bar">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="category-filters">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-section">
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <p>No products found matching your criteria</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="product-card">
                <div className="product-image-wrapper">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="product-image"
                  />
                  <div className="product-price-badge">
                    {item.price}
                  </div>
                </div>
                
                <div className="product-info">
                  <h3 className="product-name">{item.name}</h3>
                  <p className="product-description">{item.description}</p>
                  
                  <button
                    onClick={() => handleAddToCart(item.id)}
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
                        <span className="btn-icon">🛒</span>
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

      {/* Footer Info */}
      <div className="shop-footer">
        <div className="footer-card">
          <div className="footer-grid">
            <div className="footer-item">
              <div className="footer-icon">🚚</div>
              <h3 className="footer-title">Free Shipping</h3>
              <p className="footer-text">On orders over $50</p>
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