import { useNavigate } from "react-router-dom";
import "./styles/PGCard.css";

export default function PGCard({ pg }) {
  const navigate = useNavigate();

  return (
    <div className="pg-card">
      <h3>{pg.name}</h3>
      <p>📍 {pg.location}</p>

      {/* REMOVE base_rent — backend doesn’t send it */}
      <button
        className="view-btn"
        onClick={() => navigate(`/user/pg/${pg.id}`)}
      >
        👉 More Details
      </button>
    </div>
  );
}
