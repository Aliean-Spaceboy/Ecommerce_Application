import { useState } from "react";

export default function Checkout() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="main-content">
      <form onSubmit={handleSubmit}>
        <input name="name" onChange={handleChange} placeholder="Name" />
        <input name="address" onChange={handleChange} placeholder="Address" />
        <input name="email" onChange={handleChange} placeholder="Email" />
        <button className="btn btn-success">Place Order</button>
      </form>
    </div>
  );
}
