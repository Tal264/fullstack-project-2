import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [subs, setSubs] = useState([]); // members who watched this movie
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        // Fetch movie details
        const resMovie = await fetch(`http://localhost:3000/movies/${id}`);
        if (!resMovie.ok) throw new Error("Movie not found");
        const movieData = await resMovie.json();
        setMovie(movieData);

        // Fetch subscriptions for this movie
        const resSubs = await fetch(
          `http://localhost:3000/subscribers/movie/${encodeURIComponent(movieData.name)}`
        );
        if (!resSubs.ok) throw new Error("Failed to fetch subscriptions");
        const movieSubs = await resSubs.json();
        setSubs(movieSubs);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchMovieData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this movie?")) return;
    try {
      const res = await fetch(`http://localhost:3000/movies/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete movie");
      alert("Movie deleted!");
      navigate("/MoviesPage");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleEdit = () => {
    navigate(`/movies/edit/${movie._id}`);
  };

  const handleCancel = () => {
    navigate("/MoviesPage"); // or "/main" depending on your preference
  };

  if (!movie) return <p>Loading movie...</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          width: "230px",
          padding: "10px",
        }}
      >
        <img
          src={movie.image || "https://via.placeholder.com/180x250"}
          alt={movie.name}
          style={{
            width: "220px",
            height: "300px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "10px",
          }}
        />
        <h3>{movie.name}</h3>
        <p><strong>Year:</strong> {movie.year_premiered}</p>
        <p><strong>Genres:</strong> {movie.genres?.join(", ")}</p>

        <strong>Watched by:</strong>
        <ul>
          {subs.length > 0 ? (
            subs.map((sub) => (
              <li key={sub._id}>
                {sub.member ? (
                  <a href={`/members/${sub.member._id}`}>{sub.member.name}</a>
                ) : (
                  "Unknown"
                )}{" "}
                ({sub.dateWatched ? new Date(sub.dateWatched).toLocaleDateString("en-GB") : ""})
              </li>
            ))
          ) : (
            <li>No subscriptions yet</li>
          )}
        </ul>

        <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleDelete} style={{ color: "red" }}>
            Delete
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
