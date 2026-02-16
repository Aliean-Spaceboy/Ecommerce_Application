import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productService from "../services/productService";
import cartService from "../services/cartService";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    productService.getProductById(id).then((res) => {
      setProduct(res.data);
    });
  }, [id]);

  const handleAddToCart = () => {
    cartService.addToCart(product);
    alert("Product added to cart!");
  };

  if (!product) return <h3>Loading...</h3>;

  return (
    <div className="main-content">
      <div className="product-details-container">
        <div className="row">
          <div className="col-md-5">
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="img-responsive"
              style={{ width: "100%" }}
            />
          </div>

          <div className="col-md-7">
            <h2>{product.productName}</h2>
            <h4 className="price">₹ {product.unitPrice}</h4>

            <p>{product.description}</p>

            <button className="btn btn-primary" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
