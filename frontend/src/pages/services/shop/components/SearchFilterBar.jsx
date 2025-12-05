import React from "react";
import { categories } from "./shopData";

export default function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  setPageMode,
  showMobileFilters,
  setShowMobileFilters,
  cartCount,
}) {
  return (
    <div className="shop-header">
      <div className="shop-header-content">
        <div className="search-filter-bar">
          {/* 🔍 Search */}
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

          {/* 🏷 Categories */}
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

          {/* 🛒 Cart Button */}
          <div className="cart-button" onClick={() => setPageMode("cart")}>
            <span className="cart-icon">
              <i className="fa-solid fa-cart-shopping"></i>
            </span>
            <span className="cart-text">Cart ({cartCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
