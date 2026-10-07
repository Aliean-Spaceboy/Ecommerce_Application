import { useEffect, useState } from "react";
import productService from "../services/productService";
import { Link } from "react-router-dom";

export default function ProductCategoryMenu() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productService.getCategories().then((res) => {
      let data = res?.data?.data || res?.data || [];
      if (!Array.isArray(data)) data = [];
      setCategories(data);
    }).catch(err => {
      console.error(err);
      setCategories([]);
    });
  }, []);

  return (
    <ul className="nav flex-column">
      {categories.map((cat) => (
        <li key={cat.id} className="nav-item">
          <Link to={`/category/${cat.id}`} className="nav-link">
            {cat.categoryName}
          </Link>
        </li>
      ))}
    </ul>
  );
}
