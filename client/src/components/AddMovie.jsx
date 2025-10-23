import React, { useState } from "react";

export default function AddMovie({ onMovieAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    year_premiered: "",
    genres: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          genres: formData.genres.split(",").map((g) => g.trim()),
        }),
      });
      if (res.ok) {
        const newMovie = await res.json();
        alert("Movie added!");
        setFormData({ name: "", year_premiered: "", genres: "", image: "" });
        if (onMovieAdded) onMovieAdded(newMovie);
      } else {
        alert("Error adding movie");
      }
    } catch (err) {
      console.error(err);
    }
  };

    const handleCancel = () => {
  // Navigate and refresh the page
  window.location.href = "/MoviesPage";
};

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
     <label>Movie Name: </label>
      <input
        type="text"
        name="name"
        placeholder="Movie Name"
        value={formData.name}
        onChange={handleChange}
        required
      /> <br />
      <label>Year Premiered: </label>
      <input
        type="text"
        name="year_premiered"
        placeholder="Year Premiered"
        value={formData.year_premiered}
        onChange={handleChange}
      /> <br />
      <label>Genres: </label>
      <input
        type="text"
        name="genres"
        placeholder="Genres (comma-separated)"
        value={formData.genres}
        onChange={handleChange}
      />
       <br />
      <label>Image URL: </label>
      <input
        type="text"
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
      /> <br /><br />
      <button type="submit">Save</button> {" "}
      <button onClick={handleCancel}>Cancel</button>
    </form>
  );
}
