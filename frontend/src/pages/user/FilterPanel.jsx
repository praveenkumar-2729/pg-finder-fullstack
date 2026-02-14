import React from "react";

function FilterPanel({ filters, setFilters }) {

  const chennaiAreas = [
    "T. Nagar", "Velachery", "Tambaram", "Guindy", "Adyar",
    "Anna Nagar", "Porur", "OMR", "Sholinganallur",
    "Perungudi", "Thiruvanmiyur", "Ashok Nagar",
    "Kodambakkam", "Mylapore", "Royapettah"
  ];

  // Safe change handler
  const handleChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Proper reset (ALL keys included)
  const clearFilters = () => {
    setFilters({
      location: "",
      max_rent: "",
      gender: "",
      sharing: "",
      ac: "",
      mess: "",
      min_beds: ""
    });
  };

  return (
    <div className="filter-panel">

      {/* Location */}
      <select
        value={filters.location || ""}
        onChange={e => handleChange("location", e.target.value)}
      >
        <option value="">All Locations</option>
        {chennaiAreas.map(area => (
          <option key={area} value={area}>{area}</option>
        ))}
      </select>

      {/* Max Rent */}
      <input
        type="number"
        placeholder="Max Rent"
        value={filters.max_rent || ""}
        onChange={e => handleChange("max_rent", e.target.value)}
      />

      {/* Gender */}
      <select
        value={filters.gender || ""}
        onChange={e => handleChange("gender", e.target.value)}
      >
        <option value="">Any Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      {/* Sharing */}
      <select
        value={filters.sharing || ""}
        onChange={e => handleChange("sharing", e.target.value)}
      >
        <option value="">Any Sharing</option>
        <option value="2">2 Sharing</option>
        <option value="3">3 Sharing</option>
        <option value="4">4 Sharing</option>
        <option value="5">5 Sharing</option>
      </select>

      {/* AC */}
      <select
        value={filters.ac || ""}
        onChange={e => handleChange("ac", e.target.value)}
      >
        <option value="">AC / Non-AC</option>
        <option value="ac">AC</option>
        <option value="non-ac">Non-AC</option>
      </select>

      {/* Mess */}
      <select
        value={filters.mess || ""}
        onChange={e => handleChange("mess", e.target.value)}
      >
        <option value="">Mess Available?</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      {/* Minimum Beds */}
      <input
        type="number"
        placeholder="Min Beds Available"
        value={filters.min_beds || ""}
        onChange={e => handleChange("min_beds", e.target.value)}
      />

      <button onClick={clearFilters}>
        Clear Filters
      </button>

    </div>
  );
}

export default FilterPanel;
