import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/PGDetails.css";
import toast from "react-hot-toast";
import BASE_URL from "../../api";

function PGDetails() {
  const { pgId } = useParams();
  const navigate = useNavigate();

  const [pg, setPg] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const accountId = localStorage.getItem("account_id");

  useEffect(() => {
    if (!accountId) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const pgRes = await fetch(
          `${BASE_URL}/pgowner/pgs/${pgId}`
        );

        const pgData = await pgRes.json();

        if (!pgRes.ok) {
          throw new Error("PG not found");
        }

        setPg(pgData);

        const roomRes = await fetch(
          `${BASE_URL}/pgowner/pg/${pgId}/rooms`
        );

        const roomData = await roomRes.json();
        setRooms(roomData.rooms || []);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchData();
  }, [pgId, accountId]);

  if (!accountId) {
    return <h3>Please login to view PG details</h3>;
  }

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (!pg) {
    return <h3>PG not found</h3>;
  }

  const handleDeletePG = async () => {
    if (!window.confirm("Delete this PG?")) return;

    const res = await fetch(
      `${BASE_URL}/pgowner/delete-pg/${pgId}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      toast.success("PG Deleted Successfully 🗑", { duration: 2000 });
      navigate("/owner/my-pgs");
    } else {
      alert("Delete failed");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Delete this room?")) return;

    try {
      const res = await fetch(
        `${BASE_URL}/pgowner/delete-room/${roomId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.detail || "Room delete failed");
        return;
      }

      // Remove from UI instantly
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
      toast.success("Room deleted ✅", { duration: 1500 });

    } catch (err) {
      console.error(err);
      alert("Server error while deleting room");
    }
  };


  return (
    <div className="pg-details-container">
      {/* Back button */}
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
      onClick={() => navigate("/owner/my-pgs")}
    >
      ← Back
    </button>

      {/* ===== ADD ROOM BUTTON ===== */}
      <div className="top-actions-bar">
        <button
          className="add-room"
          onClick={() => navigate(`/owner/add-room/${pgId}`)}
        >
          ➕ Add Room
        </button>
      </div>

      {/* ===== TOP PG INFO CARD ===== */}
      <div className="pg-info-card">
        <h2>{pg.name}</h2>
        <p>📍 {pg.location}</p>
        <p><b>Landmark:</b> {pg.exact_location}</p>

        <p><b>Owner:</b> {pg.owner_name}</p>
        <p><b>Contact:</b> {pg.contact}</p>
        {pg.email && <p><b>Email:</b> {pg.email}</p>}
        <p>
          <b>For:</b>{" "}
          <span
            className={`gender-badge ${pg.gender}`}
          >
            {pg.gender?.toUpperCase()}
          </span>
        </p>



        <div className="pg-actions-inline">
          <button
            className="pg-btn pg-edit"
            onClick={() =>
              navigate(`/owner/edit-pg/${pg.id}`, {
                state: { pgData: pg },
              })
            }
          >
            ✏ Edit PG
          </button>

          <button
            className="pg-btn pg-delete"
            onClick={handleDeletePG}
          >
            🗑 Delete PG
          </button>
        </div>
      </div>

      {/* ===== ROOMS SECTION ===== */}
      <div className="rooms-section">
        <h3>Rooms in this PG</h3>

        {rooms.length === 0 ? (
          <p style={{ color: "red" }}>
            ❌ No rooms available. Please add rooms.
          </p>
        ) : (
          <div className="rooms-grid">
            {rooms.map((room) => (
              <div key={room.id} className="room-card">
                <p><b>Sharing:</b> {room.sharing}</p>
                <p><b>Beds:</b> {room.beds_available}</p>
                <p><b>Rent/bed:</b> ₹{room.rent_per_bed}</p>
                <p><b>AC:</b> {room.ac ? "Yes" : "No"}</p>

                <div className="room-actions">

                  <button
                    className="icon-btn edit-btn"
                    data-label="Edit Room"
                    onClick={() =>
                      navigate(`/owner/edit-room/${room.id}`, {
                        state: { roomData: room }
                      })
                    }
                  >
                    ✏
                  </button>

                  <button
                    className="icon-btn delete-btn"
                    data-label="Delete Room"
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    🗑
                  </button>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PGDetails;
