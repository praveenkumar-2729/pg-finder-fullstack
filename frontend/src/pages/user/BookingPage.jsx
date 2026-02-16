import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/BookingPage.css";
import toast from "react-hot-toast";
import BASE_URL from "../../api";

function BookingPage() {
  const { pgId, roomId } = useParams();
  const navigate = useNavigate();

  const userId = Number(localStorage.getItem("account_id"));
  const userEmail = localStorage.getItem("email") || "";
  const storedName = localStorage.getItem("name") || "";

  const [roomDetails, setRoomDetails] = useState(null);

  const [nativePlace, setNativePlace] = useState("");
  const [username, setUsername] = useState(storedName);
  const [phone, setPhone] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [bedsBooked, setBedsBooked] = useState(1);
  const [userType, setUserType] = useState("student");
  const [collegeName, setCollegeName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // ✅ Fetch Room Details
  useEffect(() => {
    fetch(`${BASE_URL}/user/pgs/${pgId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.rooms) return;

        const room = data.rooms.find(
          r => r.id === parseInt(roomId, 10)
        );

        setRoomDetails(room || null);
      })
      .catch(() => {
        toast.error("Failed to load room details");
      });
  }, [pgId, roomId]);

  // ✅ Form Validation
  const isFormValid =
    username &&
    phone.length === 10 &&
    moveDate &&
    bedsBooked > 0 &&
    (userType !== "student" || collegeName) &&
    (userType !== "employee" || companyName) &&
    (userType !== "other" || nativePlace);

    const handleBooking = async () => {
      if (isSubmitting) return;   
    
      if (!isFormValid) return;
    
      setIsSubmitting(true);     
    
      try {
        const bookingData = {
          pg_id: Number(pgId),
          room_id: parseInt(roomId, 10),
          user_id: userId,
    
          user_name: username,
          user_email: userEmail,
          user_phone: phone,
    
          move_in_date: moveDate,
          move_out_date: null,
    
          user_type: userType,
          college_name: userType === "student" ? collegeName : null,
          company_name: userType === "employee" ? companyName : null,
          native_place: userType === "other" ? nativePlace : null,
    
          beds_booked: Number(bedsBooked),
        };
    
        const res = await fetch(`${BASE_URL}/bookings/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });
    
        const data = await res.json();
    
        if (data.booking_id) {
          toast.success("Booking Confirmed ✅");
    
          setTimeout(() => {
            navigate("/user/dashboard");
          }, 1000);
        } else {
          toast.error(data.detail || "Booking failed");
          setIsSubmitting(false);   // only enable if failed
        }
    
      } catch (err) {
        toast.error("Server error!");
        setIsSubmitting(false);
      }
    };
    
    

  return (
    <div className="booking-wrapper">
      <div className="booking-card glass">
        <h2>🛏️ Confirm Your Booking</h2>

        {/* Show Available Beds */}
        {roomDetails && (
          <p style={{ color: "#555", marginBottom: "10px" }}>
            Available Beds: <b>{roomDetails.beds_available}</b>
          </p>
        )}

        {/* NAME */}
        <div className="form-group">
          <label>Your Name *</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* PHONE */}
        <div className="form-group">
          <label>Phone Number *</label>
          <input
            value={phone}
            maxLength={10}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) {
                setPhone(e.target.value);
              }
            }}
          />
        </div>

        {/* MOVE DATE */}
        <div className="form-group">
          <label>Move-in Date *</label>
          <input
            type="date"
            min={today}
            value={moveDate}
            onChange={(e) => setMoveDate(e.target.value)}
          />
        </div>

        {/* BEDS BOOKED */}
        <div className="form-group">
          <label>Beds Required *</label>
          <input
            type="number"
            min="1"
            max={roomDetails?.beds_available || 1}
            value={bedsBooked}
            onChange={(e) =>
              setBedsBooked(Number(e.target.value))
            }
          />
        </div>

        {/* USER TYPE */}
        <div className="form-group">
          <label>You are a *</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="employee">Employee</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* COLLEGE */}
        {userType === "student" && (
          <div className="form-group">
            <label>College Name *</label>
            <input
              value={collegeName}
              onChange={(e) =>
                setCollegeName(e.target.value)
              }
            />
          </div>
        )}

        {/* COMPANY */}
        {userType === "employee" && (
          <div className="form-group">
            <label>Company Name *</label>
            <input
              value={companyName}
              onChange={(e) =>
                setCompanyName(e.target.value)
              }
            />
          </div>
        )}

        {/* NATIVE PLACE */}
        {userType === "other" && (
          <div className="form-group">
            <label>Native Place *</label>
            <input
              value={nativePlace}
              onChange={(e) =>
                setNativePlace(e.target.value)
              }
            />
          </div>
        )}

<button
  className="confirm-btn"
  onClick={handleBooking}
  disabled={isSubmitting}
>
  {isSubmitting ? "⏳ Processing..." : "Confirm Booking"}
</button>


      </div>
    </div>
  );
}

export default BookingPage;
