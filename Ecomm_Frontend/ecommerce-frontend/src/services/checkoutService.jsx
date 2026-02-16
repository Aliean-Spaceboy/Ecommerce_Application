import api from "./api";

const placeOrder = (orderData) => {
  return api.post("/orders", orderData);
};

export default {
  placeOrder,
};
