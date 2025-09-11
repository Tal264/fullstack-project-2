import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function MemberCard({ member, movies, onSubscribe, onDelete, onSelectMovie, showCancelButton = false }) {
  const [showSubscribeForm, setShowSubscribeForm] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [dateWatched, setDateWatched] = useState("");
  const navigate = useNavigate();

  // Movies the member hasn't watched yet
  const unwatchedMovies = useMemo(() => {
    return movies.filter(
      (m) => !member.movies?.some((watched) => watched.name === m.name)
    );
  }, [movies, member.movies]);

  const handleSubscribeClick = () => {
    if (!selectedMovie || !dateWatched) {
      alert("Please select a movie and date");
      return;
    }
    onSubscribe(member._id, selectedMovie, dateWatched);
    setSelectedMovie("");
    setDateWatched("");
    setShowSubscribeForm(false);
  };

  const handleEditNavigate = () => navigate(`/members/edit/${member._id}`);
  const handleCancel = () => navigate("/SubscriptionPage"); 

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "10px", width: "280px", padding: "10px" }}>
      <h2>{member.name}</h2>
      <p><strong>Email:</strong> {member.email}</p>
      <p><strong>City:</strong> {member.city}</p>

      <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
        <button onClick={handleEditNavigate}>Edit</button>
        {showCancelButton && <button onClick={handleCancel}>Cancel</button>}
        <button onClick={() => onDelete(member._id)} style={{ color: "red" }}>Delete</button>
      </div>

      <div style={{ border: "1px solid #ccc", borderRadius: "10px", width: "250px", padding: "10px", marginTop: "10px" }}>
        <h3>Movies Watched</h3>
        <button onClick={() => setShowSubscribeForm(prev => !prev)}>
          Subscribe to new movie
        </button>

        {showSubscribeForm && (
          <div style={{ marginTop: "6px" }}>
            <p>Add a new movie</p>
            <select value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)} style={{ marginBottom: "6px" }}>
              <option value="">-- Select Movie --</option>
              {unwatchedMovies.map((m) => (
                <option key={m._id} value={m.name}>{m.name}</option> 
              ))}
            </select><br />
            <input type="date" value={dateWatched} onChange={(e) => setDateWatched(e.target.value)} style={{ marginBottom: "6px" }}/><br />
            <button onClick={handleSubscribeClick}>Subscribe</button>
          </div>
        )}

        <ul style={{ marginTop: "10px" }}>
          {member.movies?.length > 0 ? (
            member.movies.map((movie) => (
              <li key={movie._id || movie.name}>
                <Link
                  to={`/movies/${movie._id}`}
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  {movie.name}
                </Link>{" "}
                ({movie.date ? new Date(movie.date).toLocaleDateString() : ""})
              </li>
            ))
          ) : (
            <li>No subscriptions yet</li>
          )}
        </ul>
      </div>
    </div>
  );
}
