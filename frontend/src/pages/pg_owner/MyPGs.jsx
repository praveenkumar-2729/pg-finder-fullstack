import { useEffect, useState } from "react";
import "./styles/MyPGs.css";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api";


function MyPGs() {
  const navigate = useNavigate();

  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const accountId = localStorage.getItem("account_id");

  useEffect(() => {
    if (!accountId) {
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/pgowner/my-pgs/${accountId}`)
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          alert(data.detail || "Failed to fetch PGs");
          setLoading(false);
          return;
        }

        setPgs(data.pgs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("FETCH ERROR:", err);
        setLoading(false);
      });
  }, [accountId]);

  if (!accountId) {
    return <h3>Please login to view your PGs</h3>;
  }

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (!Array.isArray(pgs)) {
    return <h3>Something went wrong. Please refresh.</h3>;
  }

  return (
    <div className="my-pgs-container">
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
      onClick={() => navigate("/pgowner/dashboard")}
    >
      ← Back
    </button>      <h2 className="page-title">My PGs</h2>
      <div style={{ marginBottom: "15px" }}>
  <button 
    onClick={() => navigate("/owner/manage-pgs")}
   className="manage"
  >
    ⚙ Manage My PGs
  </button>
</div>


      {pgs.length === 0 ? (
        <p className="empty-text">No PGs found</p>
      ) : (
        <div className="pg-grid">
         {pgs.map((pg) => (
  <div className="pg-card" key={pg.id}>
    <h3 className="pg-name">{pg.name}</h3>

    <p className="pg-location">📍 {pg.location}</p>

    {/* ✅ NEW — PG Gender Type */}
    <p className="pg-gender">
      🏷 Type:{" "}
      <span className={`gender-badge ${pg.gender}`}>
        {pg.gender === "boys" && "Boys Only"}
        {pg.gender === "girls" && "Girls Only"}
        {pg.gender === "both" && "Boys & Girls"}
      </span>
    </p>

    <p className="pg-detail">
      <b>Status:</b> {pg.admin_status}
    </p>

    <div className="pg-actions">
      <button
        className="icon-view-btn"
        data-label="View more"
        onClick={() => navigate(`/owner/pg-details/${pg.id}`)}
      >
        👁
      </button>
    </div>
  </div>
))}

        </div>
      )}
    </div>
  );
}

export default MyPGs;
