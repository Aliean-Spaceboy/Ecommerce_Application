import { useEffect, useState } from "react";

export default function CartStatus() {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const qty = localStorage.getItem("cartQty");
    const price = localStorage.getItem("cartPrice");
    setTotalQuantity(qty || 0);
    setTotalPrice(price || 0);
  }, []);

  return (
    <div className="cart-status">
      <span>{totalQuantity}</span>
      <span>{totalPrice}</span>
    </div>
  );
}
