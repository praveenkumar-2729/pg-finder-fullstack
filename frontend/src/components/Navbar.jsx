import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../index.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, [location.pathname]);

  
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to exit?");
  
    if (confirmLogout) {
      localStorage.clear();
      setRole(null);
      navigate("/");
    }
  };

  return (
    <nav className="navbar  navbar-custom shadow-sm px-4" style={{background:"linear-gradient(to right, rgb(197, 107, 205), white)"}}>
      <div className="container d-flex justify-content-between align-items-center">

        {/* Logo */}
        <Link className="navbar-brand text-white fw-bold" to="/">
          PG Finder
        </Link>

        <div className="d-flex gap-3 align-items-center">

 

          {role && (
            <>
               <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}
