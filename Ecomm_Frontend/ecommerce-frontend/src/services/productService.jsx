import api from "./api";

const getProducts = () => {
  return api.get("/products");
};

const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

const getProductsByCategory = (categoryId) => {
  return api.get(`/products/category/${categoryId}`);
};

const getCategories = () => {
  return api.get("/product-categories");
};

export default {
  getProducts,
  getProductById,
  getProductsByCategory,
  getCategories,
};
