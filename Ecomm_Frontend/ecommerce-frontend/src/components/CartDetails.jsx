import { useEffect, useState } from "react";

export default function CartDetails() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(items);
  }, []);

  return (
    <div className="main-content">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td>{item.productName}</td>
              <td>{item.unitPrice}</td>
              <td>{item.quantity}</td>
              <td>{item.unitPrice * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
