import { useEffect, useState } from "react";
import productService from "../services/productService";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getProducts().then((res) => {
      setProducts(res.data);
    });
  }, []);

  return (
    <div className="main-content">
      <div className="section-content">
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-3">
              <div className="product-box">
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="img-responsive"
                />
                <h5>{product.productName}</h5>
                <div className="price">{product.unitPrice}</div>
                <button className="btn btn-primary btn-sm">Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
