import { useEffect, useState } from "react";
import cartService from "../services/cartService";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(cartService.getCartItems());
  }, []);

  const refreshCart = () => {
    setCartItems(cartService.getCartItems());
  };

  const removeItem = (id) => {
    cartService.removeFromCart(id);
    refreshCart();
  };

  const clearCart = () => {
    cartService.clearCart();
    refreshCart();
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  return (
    <div className="main-content">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <h4>Cart is empty</h4>
      ) : (
        <>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td>₹ {item.unitPrice}</td>
                  <td>{item.quantity}</td>
                  <td>₹ {item.unitPrice * item.quantity}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Total Price: ₹ {totalPrice}</h3>

          <button
            className="btn btn-success"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>

          <button
            className="btn btn-warning"
            style={{ marginLeft: "10px" }}
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}
