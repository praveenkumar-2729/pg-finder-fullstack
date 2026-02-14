import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../index.css";

function Home() {
  const navigate = useNavigate();

  // Auto logout when Home loads
  useEffect(() => {
    localStorage.removeItem("account_id");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
  }, []);

  return (
    <div className="home-wrapper">

      <div className="home-content">

        <h1 className="page-title gradient-text">PG Finder</h1>

        <p className="home-description">
          Find comfortable PG stays or list your own property in Chennai.
        </p>

        <p className="home-description">
          Students & Working Professionals can explore verified PG listings with smart filters.
        </p>

        <p className="home-description">
          PG Owners can post rooms, manage availability and track listings easily.
        </p>

        <div
          className="lavender-box"
          onClick={() => navigate("/login")}
        >
          <h3 className="fw-bold login-text mb-0">
            LOGIN / REGISTER
          </h3>
        </div>

        <div className="quote-section">
          <p className="quote-text">
            “Every new city begins with finding the right place to stay.”
          </p>
          <p className="quote-sub">
            Let PG Finder help you feel at home, wherever you are.
          </p>
        </div>

      </div>

      <footer className="footer">
        <h4 className="fw-bold gradient-text">PG Finder</h4>

        <p className="footer-desc">
          A simple and smart platform connecting PG seekers and property owners across Chennai.
        </p>

        <p style={{ fontSize: "13px", color: "gray" }}>
          📞 Support: pgfinder@gmail.com
        </p>

        <hr />

        <p style={{ fontSize: "12px", color: "gray" }}>
          © {new Date().getFullYear()} PG Finder — All Rights Reserved
        </p>
      </footer>

    </div>
  );
}

export default Home;
