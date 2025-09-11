import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AllMovies({ searchTerm = "" }) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await fetch("http://localhost:3000/movies");
      if (!res.ok) throw new Error("Failed to fetch movies");
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie?")) return;
    try {
      const res = await fetch(`http://localhost:3000/movies/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setMovies(movies.filter((m) => m._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter movies by searchTerm (case-insensitive)
  const displayedMovies = searchTerm
    ? movies.filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : movies;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {displayedMovies.map((movie) => (
        <div
          key={movie._id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            width: "230px",
            padding: "10px",
            display: "flex", 
            flexDirection: "column",
          }}
        >
          <img
            src={movie.image || "https://via.placeholder.com/180x250"}
            alt={movie.name}
            style={{ width: "220px", height: "300px", objectFit: "cover" }}
          />
          <h3 style={{ margin: "8px 0 8px 0" }}>{movie.name}</h3>
          
          <p style={{ marginBottom: "0" }}> <strong>Year:</strong> {movie.year_premiered}</p>
          
          <p ><strong>Genres:</strong> {movie.genres?.join(", ")}</p>

          <strong style={{ marginBottom: "2px" }}>Watched by:</strong>
          <ul>
            {movie.subscriptions?.length > 0 ? (
              movie.subscriptions.map((sub) => (
                <li key={sub._id}>
                  <Link to={`/members/${sub._id}`}>{sub.name}</Link>{" "}
                  ({new Date(sub.dateWatched).toLocaleDateString("en-GB")})
                </li>
              ))
            ) : (
              <li>No subscriptions yet</li>
            )}
          </ul>

          <div style={{ marginTop: "auto", display: "flex", gap: "5px" }}>
            <button onClick={() => navigate(`/movies/edit/${movie._id}`)}>
              Edit
            </button>
            <button onClick={() => handleDelete(movie._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
