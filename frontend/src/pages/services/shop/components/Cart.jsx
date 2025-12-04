export default function Cart({
    cartItems,
    user,
    handleDecreaseQuantity,
    handleIncreaseQuantity,
    handleRemoveFromCart,
    setPageMode
  }) {
    return (
      <div className="cart-page">
        <button className="back-button" onClick={() => setPageMode("products")}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
  
        <h2 className="cart-title">Your Cart</h2>
  
        {cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          <div className="cart-list">
            {cartItems.map((item, idx) => (
              <div key={idx} className="cart-item">
                <img src={item.img} alt={item.name} className="cart-item-image" />
  
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>
                    {item.price} x {item.quantity}
                  </p>
  
                  <div className="quantity-controls">
                    <button onClick={() => handleDecreaseQuantity(item.id)}>
                      <i className="fa-solid fa-minus"></i>
                    </button>
  
                    <span>{item.quantity}</span>
  
                    <button onClick={() => handleIncreaseQuantity(item.id)}>
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
  
        {cartItems.length > 0 && (
          <button className="checkout-btn" onClick={() => setPageMode("checkout")}>
            Proceed to Checkout
          </button>
        )}
      </div>
    );
  }
  