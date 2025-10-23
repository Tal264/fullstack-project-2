import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddMember({ onMemberAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    movies: [],
  });

  const [allMovies, setAllMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [dateWatched, setDateWatched] = useState("");
  const navigate = useNavigate();

  // Fetch all movies for dropdown
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:3000/movies");
        const data = await res.json();
        setAllMovies(data);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      }
    };
    fetchMovies();
  }, []);

  // Add movie to local form state
  const handleAddMovie = () => {
    if (!selectedMovie || !dateWatched) return;

    const newMovie = { name: selectedMovie, date: dateWatched };

    setFormData((prev) => ({
      ...prev,
      movies: [...prev.movies, newMovie],
    }));

    setSelectedMovie("");
    setDateWatched("");
  };

  // Submit new member
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.city) return;

    try {
      const res = await fetch("http://localhost:3000/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const newMember = await res.json();

      // Ensure movies array exists
      if (!newMember.movies) newMember.movies = formData.movies;

      // Pass the new member to parent
      if (onMemberAdded) onMemberAdded(newMember);

      setFormData({ name: "", email: "", city: "", movies: [] });
      alert("Member added: " + newMember.name);
    } catch (err) {
      console.error("Error adding member:", err);
      alert("Failed to add member.");
    }
  };

  // Movies not yet added to this member
  const unwatchedMovies = allMovies.filter(
    (m) => !formData.movies.some((movie) => movie.name === m.name)
  );

  const handleCancel = () => {
  // Navigate and refresh the page
  window.location.href = "/SubscriptionPage";
};

  return (
    <div>
      <h3>Add Member</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </label>
        <br />
        <label>
          City:
          <input
            type="text"
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            required
          />
        </label>
        <br />

        {/* <h4>Movies Watched</h4>
        <ul>
          {formData.movies.length > 0 ? (
            formData.movies.map((movie, idx) => (
              <li key={idx}>
                {movie.name} ({new Date(movie.date).toLocaleDateString()})
              </li>
            ))
          ) : (
            <li>No movies added yet</li>
          )}
        </ul>

        <div style={{ marginTop: "1rem" }}>
          <select
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
          >
            <option value="">-- Select Movie --</option>
            {unwatchedMovies.map((m) => (
              <option key={m._id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateWatched}
            onChange={(e) => setDateWatched(e.target.value)}
          />
          <button type="button" onClick={handleAddMovie}>
            Add Movie
          </button>
        </div> */}

        <br />
        <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
        <button type="submit">Save</button>
        <button onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
