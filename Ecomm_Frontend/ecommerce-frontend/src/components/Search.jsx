import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search/${keyword}`);
  };

  return (
    <form onSubmit={handleSearch} className="form-header">
      <input
        type="text"
        placeholder="Search products"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="input"
      />
      <button className="btn btn-primary">Search</button>
    </form>
  );
}
