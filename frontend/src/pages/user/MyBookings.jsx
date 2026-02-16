import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "./styles/MyBookings.css";
import BASE_URL from "../../api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const userEmail = localStorage.getItem("email");

    fetch(`${BASE_URL}/bookings/user/${userEmail}`)
      .then(res => res.json())
      .then(data => setBookings(data || []));
  }, []);

  const cancelBooking = async (bookingId) => {
    if (cancellingId) return; // prevent double click

    const isSure = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!isSure) return;

    setCancellingId(bookingId); // 🔒 disable this button

    try {
      const res = await fetch(
        `${BASE_URL}/bookings/${bookingId}/cancel`,
        { method: "POST" }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.detail || "Cancel failed");
        setCancellingId(null);
        return;
      }

      toast.success("Booking canceled successfully ❌");

      setBookings(prev => prev.filter(b => b.id !== bookingId));

    } catch (err) {
      toast.error("Server error while cancelling");
      setCancellingId(null);
    }
  };


  return (
    <div className="mybookings-page">
      <h2 className="mb-title">📋 My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>🎯 You have no active bookings.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map(b => (
            <div key={b.id} className="booking-card">

              <h5 className="pg-title">{b.pg_name}</h5>

              <div className="booking-info">
                <p><b>PG ID:</b> {b.pg_id}</p>
                <p><b>Room ID:</b> {b.room_id}</p>
                <p><b>Beds Booked:</b> {b.beds_booked}</p>
                <p><b>Move-in Date:</b> {b.move_in_date}</p>
              </div>

              <button
                className="cancel-btn"
                disabled={cancellingId === b.id}
                onClick={() => cancelBooking(b.id)}
              >
                {cancellingId === b.id ? "⏳ Cancelling..." : "Cancel Booking"}
              </button>


            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
