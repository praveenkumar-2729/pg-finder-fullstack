import { useNavigate } from "react-router-dom";

function Button() {
  const navigate = useNavigate();

  return (
    <button
      style={{
        marginBottom: "16px",
        padding: "8px 15px",
        borderRadius: "999px",        // 🔹 makes it pill
        border: "1px solid transparent",
        background: "white",
        color: "#2b7cff",
        cursor: "pointer",
        fontWeight: "600",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.25s ease",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      }}
      onMouseOver={(e) => {
        e.target.style.background = "#2b7cff";
        e.target.style.color = "white";
        e.target.style.boxShadow = "0 8px 18px rgba(43,124,255,0.25)";
      }}
      onMouseOut={(e) => {
        e.target.style.background = "white";
        e.target.style.color = "#2b7cff";
        e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.08)";
      }}
      onClick={() => navigate(-1)}
    >
      ← Back
    </button>
  );
}

export default Button;
