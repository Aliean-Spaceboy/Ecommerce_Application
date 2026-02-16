const CART_KEY = "cartItems";

const getCartItems = () => {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
};

const saveCartItems = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const addToCart = (product) => {
  const cart = getCartItems();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCartItems(cart);
};

const removeFromCart = (productId) => {
  const cart = getCartItems().filter((item) => item.id !== productId);
  saveCartItems(cart);
};

const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};

export default {
  getCartItems,
  addToCart,
  removeFromCart,
  clearCart,
};
