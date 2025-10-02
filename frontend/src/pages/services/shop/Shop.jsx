import React from 'react';
import './Shop.css';

function Shop() {
  const items = [
    { id: 1, name: "Compost Bin", price: "$25", description: "Eco-friendly compost bin.", img: "/assets/box.png" },
    { id: 2, name: "Recycling Bags", price: "$10", description: "Reusable recycling bags.", img: "/assets/box.png" },
    { id: 3, name: "Gloves", price: "$5", description: "Durable gloves for cleanups.", img: "/assets/box.png" },
    { id: 4, name: "Trash Picker", price: "$15", description: "Ergonomic trash picker.", img: "/assets/box.png" },
    { id: 5, name: "Recyclable Bin", price: "$30", description: "Separate bin for recyclables.", img: "/assets/box.png" },
    { id: 6, name: "Safety Vest", price: "$12", description: "Reflective safety vest.", img: "/assets/box.png" },
    { id: 7, name: "Face Mask", price: "$8", description: "Breathable face mask.", img: "/assets/box.png" },
    { id: 8, name: "Hand Sanitizer", price: "$4", description: "Portable hand sanitizer.", img: "/assets/box.png" },
    { id: 9, name: "Water Bottle", price: "$10", description: "Reusable water bottle.", img: "/assets/box.png" },
    { id: 10, name: "Eco Bag", price: "$7", description: "Reusable shopping bag.", img: "/assets/box.png" },
  ];

  const handleAddToCart = (id) => {
    alert(`Added item ID ${id} to cart`);
    // Replace with your backend cart API logic
  };

  return (
    <div className="shop-container">
      <h1 className="shop-title">Shop</h1>
      <div className="shop-grid">
        {items.map((item) => (
          <div key={item.id} className="shop-card">
            <img src={item.img} alt={item.name} />
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <p className="price">{item.price}</p>
            <button onClick={() => handleAddToCart(item.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;
