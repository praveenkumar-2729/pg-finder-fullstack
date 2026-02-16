import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/PostPGs.css";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import BASE_URL from "../../api";

function EditPG() {
  const { id } = useParams();
  const navigate = useNavigate();

  const accountId = localStorage.getItem("account_id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pg, setPg] = useState({
    name: "",
    location: "",
    exact_location: "",
    owner_name: "",
    contact: "",
    email: "",
    gender:"",
  });

  /* ========== FETCH EXISTING PG ========== */
  useEffect(() => {
    if (!accountId) {
      navigate("/login");
      return;
    }

    async function fetchPG() {
      try {
        const res = await fetch(
          `${BASE_URL}/pgowner/pgs/${id}`
        );

        const data = await res.json();

        if (!res.ok) {
          alert("PG not found");
          navigate("/owner/my-pgs");
          return;
        }

        setPg({
          name: data.name || "",
          location: data.location || "",
          exact_location: data.exact_location || "",
          owner_name: data.owner_name || "",
          contact: data.contact || "",
          email: data.email || "",
          gender: data.gender || "",
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load PG");
        navigate("/owner/my-pgs");
      }
    }

    fetchPG();
  }, [id, accountId, navigate]);

  /* ========== HANDLE CHANGE ========== */
  const handleChange = (field, value) => {
    setPg((prev) => ({ ...prev, [field]: value }));
  };

  /* ========== UPDATE SUBMIT ========== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: pg.name,
      location: pg.location,
      exact_location: pg.exact_location,
      owner_name: pg.owner_name,
      contact: pg.contact,
      email: pg.email || null,
      gender: pg.gender,
        };

    try {
      const res = await fetch(
        `${BASE_URL}/pgowner/update-pg/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Update failed");
        setSaving(false);
        return;
      }

      toast.success("PG Updated successfully", { duration: 1800 });

      setTimeout(() => {
        navigate(`/owner/pg-details/${id}`);
      }, 1800);
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  const chennaiAreas = [
    "T. Nagar",
    "Velachery",
    "Tambaram",
    "Guindy",
    "Adyar",
    "Anna Nagar",
    "Porur",
    "OMR",
    "Sholinganallur",
    "Perungudi",
    "Thiruvanmiyur",
    "Ashok Nagar",
    "Kodambakkam",
    "Mylapore",
    "Royapettah",
  ];

  return (
    <div className="postpg-container">
      <div className="postpg-card">
        <Button />

        <form onSubmit={handleSubmit}>
          <h2>Edit PG</h2>

          <div className="postpg-grid">
            <div className="pg-section span-2">
              <h4>Basic Details</h4>

              <input
                value={pg.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="PG Name"
                required
              />

              <select
                required
                value={pg.location}
                onChange={(e) => handleChange("location", e.target.value)}
              >
                <option value="">Select Area (Chennai)</option>
                {chennaiAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>

              <input
                value={pg.exact_location}
                onChange={(e) =>
                  handleChange("exact_location", e.target.value)
                }
                placeholder="Exact Location (Landmark)"
                required
              />

              <input
                value={pg.owner_name}
                onChange={(e) =>
                  handleChange("owner_name", e.target.value)
                }
                placeholder="Owner Name"
                required
              />
              <select
                required
                value={pg.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">Select PG Type</option>
                <option value="boys">Boys Only</option>
                <option value="girls">Girls Only</option>
                <option value="both">Both (Separate Rooms)</option>
              </select>

              <input
                value={pg.contact}
                onChange={(e) =>
                  handleChange("contact", e.target.value.replace(/\D/g, ""))
                }
                placeholder="Contact Number"
                required
              />

              <input
                type="email"
                value={pg.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Email (optional)"
              />
            </div>

            <div className="span-2">
              <button className="pg-btn" type="submit" disabled={saving}>
                {saving ? "Updating..." : "Update PG"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPG;
