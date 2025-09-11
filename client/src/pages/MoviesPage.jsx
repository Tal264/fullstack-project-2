import React, { useState } from "react";
import AllMovies from "./AllMoviesPage"; // your list component
import AddMovie from "../components/AddMovie";

export default function MoviesPage() {
  const [activeTab, setActiveTab] = useState("all"); // default tab
  const [search, setSearch] = useState(""); // search input

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        width: "1350px",
        height: "100%",
        padding: "20px",
        position: "relative",
      }}
    >
      <h2>Movies</h2>

      {/* Menu + Search */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
        <button
          onClick={() => setActiveTab("all")}
          style={{ fontWeight: activeTab === "all" ? "bold" : "normal" }}
        >
          All Movies
        </button>
        <button
          onClick={() => setActiveTab("add")}
          style={{ fontWeight: activeTab === "add" ? "bold" : "normal" }}
        >
          Add Movie
        </button>

        {activeTab === "all" && (
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
            style={{ marginLeft: "20px", padding: "5px", flexGrow: 1, maxWidth: "300px" }}
          />
        )}
      </div>

      {/* Content */}
      <div>
        {activeTab === "all" && <AllMovies searchTerm={search} />}
        {activeTab === "add" && <AddMovie />}
      </div>
    </div>
  );
}
