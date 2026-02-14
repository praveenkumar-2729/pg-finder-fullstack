import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    const res = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("account_id", data.id);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name",data.name)
      localStorage.setItem("email",data.email)
      const userEmail = data.email || form.email;
      localStorage.setItem("email", userEmail);
      if (data.role === "owner") {
        navigate("/pgowner/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } else {
      alert("Invalid login");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3 className="text-center">Login</h3>

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="form-control mt-2"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="form-control mt-2"
      />

      <button className="btn btn-success w-100 mt-3" onClick={handleLogin}>
        Login
      </button>

      {/* 👇 THIS IS IMPORTANT */}
      <p className="text-center mt-3">
        New user?{" "}
        <Link to="/register" style={{ textDecoration: "none" }}>
          Register here
        </Link>
      </p>
    </div>
  );
}
