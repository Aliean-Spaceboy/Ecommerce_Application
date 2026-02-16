import { useEffect, useState } from "react";
import productService from "../services/productService";
import { Link } from "react-router-dom";

export default function ProductCategoryMenu() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productService.getCategories().then((res) => {
      setCategories(res.data);
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
