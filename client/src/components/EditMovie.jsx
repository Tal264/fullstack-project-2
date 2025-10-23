import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditMovie() {
  const { id } = useParams(); // movie id from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    year_premiered: "",
    genres: "",
    image: "",
  });
  const [error, setError] = useState("");

  // Fetch movie details on load
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`http://localhost:3000/movies/${id}`);
        if (!res.ok) throw new Error("Failed to fetch movie");
        const data = await res.json();
        setFormData({
          name: data.name || "",
          year_premiered: data.year_premiered || "",
          genres: data.genres?.join(", ") || "",
          image: data.image || "",
        });
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMovie();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const updatedMovie = {
        ...formData,
        genres: formData.genres
          ? formData.genres.split(",").map((g) => g.trim())
          : [],
      };

      const res = await fetch(`http://localhost:3000/movies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMovie),
      });

      if (!res.ok) throw new Error("Failed to update movie");

      navigate("/main"); 
    } catch (err) {
      alert("Error updating movie: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px",  margin: "20px 0 20px 20px", padding: "15px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Edit Movie</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label>Name:</label>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      /> <br />
      <label>Year Premiered:</label>
      <input
        type="text"
        name="year_premiered"
        placeholder="Year Premiered"
        value={formData.year_premiered}
        onChange={handleChange}
      /> <br />
      <label>Genres (comma separated):</label>
      <input
        type="text"
        name="genres"
        placeholder="Genres (comma separated)"
        value={formData.genres}
        onChange={handleChange}
      /> <br />
      <label>Image URL:</label>
      <input
        type="text"
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
      />

      {formData.image && (
        <img
          src={formData.image}
          alt="Preview"
          style={{ width: "150px", height: "200px", objectFit: "cover", marginTop: "10px" }}
        />
      )}

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button onClick={handleUpdate}>Update</button>
        <button onClick={() => navigate("/main")}>Cancel</button>
      </div>
    </div>
  );
}
