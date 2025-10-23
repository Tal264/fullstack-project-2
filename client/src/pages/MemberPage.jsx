import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MemberCard from "../components/MemberCard";

export default function MemberPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch all movies
        const moviesRes = await fetch("http://localhost:3000/movies");
        if (!moviesRes.ok) throw new Error("Failed to fetch movies");
        const moviesData = await moviesRes.json();
        const moviesWithId = moviesData.map((m) => ({ ...m, id: m._id }));
        setMovies(moviesWithId);

        // Fetch member by ID
        const memberRes = await fetch(`http://localhost:3000/members/${id}`);
        if (!memberRes.ok) throw new Error("Member not found");
        const memberData = await memberRes.json();

        if (!memberData.movies) memberData.movies = [];
        setMember(memberData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);


const handleSubscribe = async (memberId, movieName, date) => {
  try {
    const res = await fetch(`http://localhost:3000/subscribers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memberId,
        movieName,
        dateWatched: date,
      }),
    });

    if (!res.ok) throw new Error("Failed to subscribe to movie");

    const newSubscription = await res.json();

    // Update local state: add new movie to member.movies
    setMember((prev) => ({
      ...prev,
      movies: [...(prev.movies || []), { name: movieName, date }],
    }));
  } catch (err) {
    console.error("Error subscribing member:", err);
    setError(err.message);
  }
};



  const handleDelete = async (memberId) => {
    try {
      const res = await fetch(`http://localhost:3000/members/${memberId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete member");
      navigate("/SubscriptionPage");
    } catch (err) {
      console.error("Error deleting member:", err);
      setError(err.message);
    }
  };

  const handleUpdate = (updatedMember) => {
    if (!updatedMember.movies) updatedMember.movies = [];
    setMember(updatedMember);
  };

  const handleSelectMovie = (movieName) => {
    const selected = movies.find((m) => m.name === movieName);
    if (selected && selected.id) {
      navigate(`/movies/${selected.id}`);
    } else {
      console.warn("Movie not found or missing ID:", movieName);
    }
  };

  if (loading) return <p>Loading member...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <MemberCard
      member={member}
      movies={movies}
      onSubscribe={handleSubscribe}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      onSelectMovie={handleSelectMovie}
      showCancelButton={true}
    />
  );
}
