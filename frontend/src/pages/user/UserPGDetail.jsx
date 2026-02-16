import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/UserPGDetails.css";
import BASE_URL from "../../api";

function UserPGDetail() {
  const { pgId } = useParams();
  const navigate = useNavigate();

  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch PG Details
  useEffect(() => {
    fetch(`${BASE_URL}/user/pgs/${pgId}`)
      .then(res => res.json())
      .then(data => {
        setPg(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [pgId]);

  if (loading) return <p>Loading PG details...</p>;
  if (!pg) return <p>PG not found</p>;

  return (
    <div className="pg-detail-wrapper">
      <h2>🏠 {pg.name}</h2>
      <p>📍 {pg.location}</p>
      <p><b>Landmark:</b> {pg.exact_location}</p>

      <h3>Available Rooms</h3>

      <div className="rooms-grid">
        {!pg.rooms || pg.rooms.length === 0 ? (
          <p style={{ color: "red" }}>No rooms available</p>
        ) : (
          pg.rooms.map((room) => {
            if (!room) return null;

            const isFull = room.beds_available === 0;

            return (
              <div
                key={room.id}
                className={`room-card ${isFull ? "room-full" : ""}`}
              >
                <p><b>Sharing:</b> {room.sharing}</p>
                <p><b>Beds Available:</b> {room.beds_available}</p>
                <p><b>Rent per Bed:</b> ₹{room.rent_per_bed}</p>

                {/* 🔥 Show badge if full */}
                {isFull && (
                  <p className="full-badge">Room Fully Booked</p>
                )}

                {/* 🔥 Disable button if full */}
                <button
                  className={`book-btn ${isFull ? "disabled-btn" : ""}`}
                  disabled={isFull}
                  onClick={() =>
                    !isFull && navigate(`/book/${pgId}/${room.id}`)
                  }
                >
                  {isFull ? "No Beds Available" : "Book this Room"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default UserPGDetail;
