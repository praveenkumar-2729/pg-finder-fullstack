import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import "./styles/PostPGs.css";
import Button from "../../components/Button";

function AddRoom() {
  const navigate = useNavigate();
  const { pgId } = useParams();


  const [form, setForm] = useState({
    sharing: "",
    ac: "",
    beds_available: "",
    rent_per_bed: "",
    attached_bathroom: "",
    food: "",
    gender: "",
    wifi: "Not mentioned",
    laundry: "Not mentioned",
    parking: "Not mentioned",
    housekeeping: "Not mentioned",
    cctv_24_7: "Not mentioned",
    security_guard: "Not mentioned",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!pgId) {
      alert("Invalid PG. Go back and select a PG first.");
      navigate("/owner/my-pgs");
    }
  }, [pgId, navigate]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ======== NEW: Dynamic beds options based on sharing ========
  const getBedOptions = () => {
    const sharing = Number(form.sharing);

    if (!sharing) return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return Array.from({ length: sharing }, (_, i) => i + 1);
  };
  // ===========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pgId) {
      alert("PG not selected!");
      return;
    }

    const sharing = Number(form.sharing);
    const beds = Number(form.beds_available);

    // ======== VALIDATION RULE YOU WANTED ========
    if (beds > sharing) {
      alert(`Beds cannot be more than sharing (${sharing})`);
      return;
    }
    // ===========================================

    setSubmitting(true);

    const payload = {
      sharing: Number(form.sharing),
      ac: form.ac === "ac",
      beds_available: Number(form.beds_available),
      rent_per_bed: Number(form.rent_per_bed),
      attached_bathroom: form.attached_bathroom === "attached",
      food: form.food,
      gender:form.gender,
      wifi: form.wifi,
      laundry: form.laundry,
      parking: form.parking,
      housekeeping: form.housekeeping,
      cctv_24_7: form.cctv_24_7,
      security_guard: form.security_guard,
    };

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/pgowner/pg/${pgId}/rooms`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Room add failed");
        setSubmitting(false);
        return;
      }

      toast.success("Room added successfully 🎉", { duration: 1800 });

      setTimeout(() => {
        navigate(`/owner/pg-details/${pgId}`);
      }, 1800);

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="postpg-container">
      <div className="postpg-card">
        <Button />

        <h2>Add Rooms to PG (ID: {pgId})</h2>

        <form onSubmit={handleSubmit} className="postpg-grid">

          {/* ROOM BASICS */}
          <section className="pg-section span-2">
            <h4>Room Details *</h4>

            <label>Sharing</label>
            <select
              required
              value={form.sharing}
              onChange={(e) => handleChange("sharing", e.target.value)}
            >
              <option value="">Select sharing</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            <label>Room For</label>

            <select
              required
              value={form.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option value="">Select</option>
              <option value="boys">Boys Only</option>
              <option value="girls">Girls Only</option>
            </select>


            <label>AC / Non-AC</label>
            <select
              required
              value={form.ac}
              onChange={(e) => handleChange("ac", e.target.value)}
            >
              <option value="">Select</option>
              <option value="ac">AC</option>
              <option value="non-ac">Non-AC</option>
            </select>

            <label>Beds Available</label>
            <select
              required
              value={form.beds_available}
              onChange={(e) => handleChange("beds_available", e.target.value)}
            >
              <option value="">Select beds</option>
              {getBedOptions().map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>


            <label>Rent per Bed (₹)</label>
            <input
              required
              inputMode="numeric"
              maxLength={6}
              placeholder="e.g. 5000"
              value={form.rent_per_bed}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                handleChange("rent_per_bed", onlyNumbers);
              }}
            />


            <label>Bathroom</label>
            <select
              required
              value={form.attached_bathroom}
              onChange={(e) =>
                handleChange("attached_bathroom", e.target.value)
              }
            >
              <option value="">Select</option>
              <option value="attached">Attached</option>
              <option value="common">Common</option>
            </select>

            <label>Food</label>
            <select
              required
              value={form.food}
              onChange={(e) => handleChange("food", e.target.value)}
            >
              <option value="">Select</option>
              <option value="veg">Veg</option>
              <option value="nonveg">Non-veg</option>
              <option value="both">Both</option>
            </select>
          </section>

          {/* FACILITIES */}
          <section className="pg-section span-2">
            <h4>Facilities (optional)</h4>

            {[
              "wifi",
              "laundry",
              "parking",
              "housekeeping",
              "cctv_24_7",
              "security_guard",
            ].map((f) => (
              <div key={f}>
                <label>{f.replace("_", " ")}</label>
                <select
                  value={form[f]}
                  onChange={(e) => handleChange(f, e.target.value)}
                >
                  <option value="Not mentioned">Not mentioned</option>
                  <option value="Available">Available</option>
                </select>
              </div>
            ))}
          </section>

          <button
            className={`pg-btn span-2 ${submitting ? "loading" : ""}`}
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Adding Room..." : "Add Room"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddRoom;
