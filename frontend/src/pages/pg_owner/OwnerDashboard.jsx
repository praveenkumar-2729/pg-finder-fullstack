import { useNavigate } from "react-router-dom";
import "./styles/PGOwnerDashboard.css";

export default function PGOwnerDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("name");

  return (
    <div className="owner-dashboard">

      {/* Welcome Card */}
      <div className="welcome-card glass">
        <h2>👋 Welcome, {username}</h2>
        <p>
          Register your PG first. After that you can manage your PG and rooms.
        </p>

        {/* 🔧 NEW — Small Manage PG link at top */}

      </div>


      <div className="manage-wrapper">
        <p
          className="manage-pg-link"
          onClick={() => navigate("/owner/manage-pgs")}
        >
          <span>🔧</span> Manage My PGs
        </p>
      </div>

      {/* Actions — now only TWO cards */}
      <div className="owner-actions">

        {/* Register PG */}
        <div
          className="action-card"
          onClick={() => navigate("/owner/register-pg")}
        >
          <div className="icon">🏠</div>
          <h4>Register New PG</h4>
          <p>Submit basic PG details (name, location, owner info)</p>
        </div>

        {/* My PGs */}
        <div
          className="action-card"
          onClick={() => navigate("/owner/my-pgs")}
        >
          <div className="icon">📋</div>
          <h4>My PGs</h4>
          <p>View your PG details and manage rooms</p>
        </div>

      </div>
    </div>
  );
}
