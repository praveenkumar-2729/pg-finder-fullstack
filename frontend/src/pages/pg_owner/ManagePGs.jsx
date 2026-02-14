import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ManagePGs.css"; // reuse your grid styles
import toast from "react-hot-toast";
import Button from "../../components/Button";

export default function ManagePGs() {
  const navigate = useNavigate();
  const accountId = localStorage.getItem("account_id");

  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accountId) {
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/pgowner/my-pgs/${accountId}`)
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

  const handleDelete = async (pgId) => {
    if (!window.confirm("Are you sure you want to delete this PG?")) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/pgowner/delete-pg/${pgId}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Delete failed");
        return;
      }

      // Remove from UI instantly
      setPgs((prev) => prev.filter((pg) => pg.id !== pgId));
      toast.success("PG Deleted Successfully 🗑 ", {
        duration: 2000,
      });    } catch (err) {
      console.error(err);
      alert("Error deleting PG");
    }
  };

  if (!accountId) {
    return <h3>Please login to manage your PGs</h3>;
  }

  if (loading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="my-pgs-container">
      <Button/>
      <h2 className="page-title">Manage My PGs</h2>

      {pgs.length === 0 ? (
        <p className="empty-text">No PGs found</p>
      ) : (
        <div className="pg-grid">
          {pgs.map((pg) => (
            <div className="pg-card" key={pg.id}>
              <h3 className="pg-name">{pg.name}</h3>

              <p className="pg-location">📍 {pg.location}</p>
              <p className="pg-detail">
                <b>Status:</b> {pg.admin_status}
              </p>

              <div className="pg-actions">

<button className="icon-btn edit-btn" data-label="Edit PG"
  onClick={() => navigate(`/owner/edit-pg/${pg.id}`)}>
  ✏
</button>

<button className="icon-btn delete-btn" data-label="Delete PG"
  onClick={() => handleDelete(pg.id)}>
  🗑
</button>


</div>



            </div>
          ))}
        </div>
      )}
    </div>
  );
}
