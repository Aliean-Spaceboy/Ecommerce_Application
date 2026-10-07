import api from "./api";

const mapProduct = (p) => ({
  ...p,
  id: p.productId,
  productName: p.name,
  imageUrl: p.imgUrl,
});

const getProducts = () => {
  return api.get("/products").then((res) => {
    let items = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.content || []);
    return { data: items.map(mapProduct) };
  });
};

const getProductById = (id) => {
  return api.get(`/products/${id}`).then((res) => {
    let item = res.data?.data || res.data;
    return { data: item ? mapProduct(item) : null };
  });
};

const getProductsByCategory = (categoryId) => {
  return api.get(`/products/category/${categoryId}`).then((res) => {
    let items = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.content || []);
    return { data: items.map(mapProduct) };
  });
};

const mapCategory = (c) => ({
  ...c,
  id: c.categoryId || c.catogoryId, // Handle backend typo "catogoryId"
  categoryName: c.name || c.categoryName
});

const getCategories = () => {
  return api.get("/product-categories").then((res) => {
    let items = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.content || []);
    return { data: items.map(mapCategory) };
  });
};

export default {
  getProducts,
  getProductById,
  getProductsByCategory,
  getCategories,
};
