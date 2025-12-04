export default function Checkout({ cartItems, setPageMode, handleCheckout }) {
  return (
    <div className="checkout-page">
      <button className="back-button" onClick={() => setPageMode("cart")}>
        <i className="fa-solid fa-arrow-left"></i> Back to Cart
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
                    src={item.img}
                    alt={item.name}
                    className="checkout-item-img"
                  />
                  <div className="checkout-item-info">
                    <span className="checkout-item-name">{item.name}</span>
                    <span className="checkout-item-qty">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>

                <span className="checkout-item-price">₹ {item.price}</span>
              </li>
            ))}
          </ul>

          <div className="checkout-summary">
            <div className="checkout-total">
              Total: ₹{" "}
              {cartItems
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toLocaleString("en-IN")}
            </div>

            <button className="pay-btn" onClick={handleCheckout}>
              Pay Now
            </button>
          </div>
        </>
      )}
    </div>
  );
}
