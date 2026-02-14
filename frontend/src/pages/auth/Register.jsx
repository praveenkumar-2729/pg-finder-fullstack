import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleRegister = async () => {
        const res = await fetch("http://localhost:8000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            alert("Registered successfully");
            navigate("/login");
        } else {
            alert("email already registered");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 400 }}>
            <h3>Register</h3>

            <input name="name" placeholder="Name" onChange={handleChange} className="form-control mt-2" />
            <input name="email" placeholder="Email" onChange={handleChange} className="form-control mt-2" />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} className="form-control mt-2" />
            <h5 className="mt-3">Looking  for :</h5>
            <select name="role" onChange={handleChange} className="form-control mt-2">
                
                <option value="user">Search PG</option>
                <option value="owner">To Post Your PG(PG owner)</option>
            </select>

            <button className="btn btn-primary w-100 mt-3" onClick={handleRegister}>
                Register
            </button>
            <p className="text-center mt-3">
                Already have an account?{" "}
                <Link to="/login" style={{ textDecoration: "none" }}>
                    Login
                </Link>
            </p>
        </div>
    );
}
