import { useState } from "react";

export default function CartStatus() {
  const [totalQuantity] = useState(() => localStorage.getItem("cartQty") || 0);
  const [totalPrice] = useState(() => localStorage.getItem("cartPrice") || 0);

  return (
    <div className="cart-status">
      <span>{totalQuantity}</span>
      <span>{totalPrice}</span>
    </div>
  );
}
