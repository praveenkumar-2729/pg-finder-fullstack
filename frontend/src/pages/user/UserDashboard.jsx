import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PGCard from "./PGCard";
import "./styles/UserDashboard.css";
import "./styles/Filter.css";
import FilterPanel from "./FilterPanel";

function UserDashboard() {
  const navigate = useNavigate();
  const pgListRef = useRef(null);
  const filterRef = useRef(null);

  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [hasLoadedAllPGs, setHasLoadedAllPGs] = useState(false);

  const name = localStorage.getItem("name");

  const [filters, setFilters] = useState({
    location: "",
    max_rent: "",
    gender: "",
    sharing: "",
    ac: "",
    mess: "",
    min_beds: ""
  });


  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      const confirmLeave = window.confirm(
        "Are you sure you want to logout?"
      );

      if (!confirmLeave) {
        window.history.pushState(null, "", window.location.href);
      } else {
        navigate("/login");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // -----------------------------
  // LOAD PREVIEW
  // -----------------------------
  useEffect(() => {
    fetch("http://127.0.0.1:8000/user/pgs/preview")
      .then(res => res.json())
      .then(data => {
        setPgs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showFilterPanel &&
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setShowFilterPanel(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterPanel]);
  

  const goBackToDashboard = () => {
    setHasLoadedAllPGs(false);
    setShowFilterPanel(false);
  };

  // -----------------------------
  // LOAD ALL PGs
  // -----------------------------
  const loadAllPGs = () => {
    setLoading(true);

    fetch("http://127.0.0.1:8000/user/pgs")
      .then(res => res.json())
      .then(data => {
        setPgs(Array.isArray(data) ? data : []);
        setLoading(false);
        setHasLoadedAllPGs(true);
      });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h3>Loading PGs...</h3>
        <p>Please wait ⏳</p>
      </div>
    );
  }

  // -----------------------------
  // FULL FILTER LOGIC
  // -----------------------------
  const filteredPGs = hasLoadedAllPGs
    ? pgs.filter(pg => {

      // ----------------
      // PG LEVEL FILTERS
      // ----------------

      if (
        filters.location &&
        !pg.location?.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.gender &&
        pg.gender &&
        pg.gender.toLowerCase() !== filters.gender.toLowerCase()
      ) {
        return false;
      }

      // ----------------
      // MESS FILTER (based on room.food)
      // ----------------

      if (filters.mess) {

        if (!pg.rooms || pg.rooms.length === 0) {
          return false;
        }

        const messMatchingRooms = pg.rooms.filter(room => {
          return room.food && room.food.toLowerCase() !== "not mentioned";
        });

        if (filters.mess === "yes" && messMatchingRooms.length === 0) {
          return false;
        }

        if (filters.mess === "no" && messMatchingRooms.length > 0) {
          return false;
        }
      }


      // ----------------
      // ROOM LEVEL FILTERS
      // ----------------

      const roomFilterApplied =
        filters.max_rent ||
        filters.sharing ||
        filters.ac ||
        filters.min_beds;

      if (!roomFilterApplied) {
        return true;
      }

      if (!pg.rooms || pg.rooms.length === 0) {
        return false;
      }

      const matchingRooms = pg.rooms.filter(room => {

        if (
          filters.max_rent &&
          Number(room.rent_per_bed) > Number(filters.max_rent)
        ) {
          return false;
        }

        if (
          filters.sharing &&
          Number(room.sharing) !== Number(filters.sharing)
        ) {
          return false;
        }

        if (filters.ac === "ac" && !room.ac) return false;
        if (filters.ac === "non-ac" && room.ac) return false;

        if (
          filters.min_beds &&
          Number(room.beds_available) < Number(filters.min_beds)
        ) {
          return false;
        }

        return true;
      });

      return matchingRooms.length > 0;
    })
    : pgs;

  return (
    <div className="dashboard">

      {hasLoadedAllPGs && (
        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilterPanel(prev => !prev)}
        >
          🔍 Filter
        </button>
      )}

      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "10px" }}>
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/user/my-bookings")}
        >
          📋 My Bookings
        </button>
      </div>

      {hasLoadedAllPGs && (
        <button className="back-btn" onClick={goBackToDashboard}>
          ← Back to Dashboard
        </button>
      )}

      {!hasLoadedAllPGs && (
        <>
          <div className="dashboard-hero">
            <h1>Hi {name},</h1>
            <b>Find your perfect PG</b>
            <p>Comfortable stays, best locations, affordable rents.</p>

            <button className="primary-btn" onClick={loadAllPGs}>
              Looking for PG
            </button>
          </div>

          <h3 className="section-title">Recommended PGs</h3>

          <div className="pg-preview">
            {pgs.slice(0, 3).map(pg => (
              <PGCard key={pg.id} pg={pg} />
            ))}
          </div>
        </>
      )}

      {hasLoadedAllPGs && (
        <>
          <h2>Hi {name}, here are all PGs</h2>

          {showFilterPanel && (
            <div ref={filterRef}>
              <FilterPanel filters={filters} setFilters={setFilters} />
            </div>
          )}


          <h3 className="section-title">Available PGs</h3>

          <div className="pg-preview">
            {filteredPGs.length === 0 ? (
              <div className="no-results">
                😔 Sorry, we don’t have any PGs for your requirement
              </div>
            ) : (
              filteredPGs.map(pg => (
                <PGCard key={pg.id} pg={pg} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default UserDashboard;
