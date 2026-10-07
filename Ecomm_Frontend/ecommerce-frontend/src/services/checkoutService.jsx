import api from "./api";

const placeOrder = (orderData) => {
  // Map frontend-friendly fields to backend DTO expectations
  const payload = {
    ...orderData,
    orderItemDto: orderData.orderItemDto.map(item => ({
      orderid: item.productId,
      quentity: item.quantity,
      unitPrice: item.unitPrice || (item.totalPrice / item.quantity),
      orderName: item.productName || "Product",
      imageUrl: item.imageUrl || ""
    }))
  };

  return api.post("/orders", payload);
};

const updateOrder = (callbackData) => {
  return api.put("/orders", callbackData);
};

export default {
  placeOrder,
  updateOrder,
};
