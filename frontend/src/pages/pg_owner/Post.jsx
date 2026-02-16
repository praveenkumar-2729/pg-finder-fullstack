import { useState } from "react";
import "./styles/PostPGs.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import BASE_URL from "../../api";

function Post() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [exactLocation, setExactLocation] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const ownerId = Number(localStorage.getItem("account_id"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!e.currentTarget.reportValidity()) return;
    if (isSubmitting) return;

    if (!ownerId) {
      alert("Login expired");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name,
      location,
      exact_location: exactLocation,
      owner_name: ownerName,
      contact,
      email: email || null,
      owner_id: ownerId,
      gender, 
    };

    try {
      const res = await fetch(`${BASE_URL}/pgowner/register-pg`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Failed");
        setIsSubmitting(false);
        return;
      }

      toast.success("PG Registered Successfully 🎉", {
        duration: 2000,
      });

      // ✅ NEW FLOW: go to My PGs page
      setTimeout(() => {
        navigate("/owner/my-pgs");
      }, 2000);

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const chennaiAreas = [
    "T. Nagar", "Velachery", "Tambaram", "Guindy", "Adyar", "Anna Nagar", "Porur",
    "OMR", "Sholinganallur", "Perungudi", "Thiruvanmiyur", "Ashok Nagar", "Kodambakkam",
    "Mylapore", "Royapettah"
  ];

  return (
    <div className="postpg-container">


      <div className="postpg-card">
        <Button />
        <h2>Register Your PG</h2>

        <form onSubmit={handleSubmit} className="postpg-grid">

          <section className="pg-section span-2">
            <h4>Basic Details <span className="text-danger">*</span></h4>

            <input
              required
              placeholder="PG Name"
              onChange={e => setName(e.target.value)}
            />

            <select
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
            >
              <option value="">Select Area (Chennai)</option>
              {chennaiAreas.map(area => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            <input
              required
              placeholder="Exact Location (Landmark)"
              onChange={e => setExactLocation(e.target.value)}
            />

            <input
              required
              placeholder="Owner Name"
              onChange={e => setOwnerName(e.target.value)}
            />

            <input
              required
              placeholder="Contact Number"
              inputMode="numeric"
              maxLength={10}
              value={contact}
              onChange={e => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                if (onlyNumbers.length <= 10) {
                  setContact(onlyNumbers);
                }
              }}
            />

            <select
              required
              value={gender}
              onChange={e => setGender(e.target.value)}
            >
              <option value="">Select PG Type</option>
              <option value="boys">Boys Only</option>
              <option value="girls">Girls Only</option>
              <option value="both">Both (Separate Rooms)</option>
            </select>

            <input
              placeholder="Email (optional)"
              type="email"
              onChange={e => setEmail(e.target.value)}
            />
          </section>

          <button
            className={`pg-btn span-2 ${isSubmitting ? "loading" : ""}`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering PG..." : "Register PG"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Post;
