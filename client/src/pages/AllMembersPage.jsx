import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MemberCard from "../components/MemberCard";

export default function AllMembersPage({ onMovieSelect, membersProp }) {
  const [members, setMembers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchMembers();
    fetchMovies();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch("http://localhost:3000/members");
      if (!res.ok) throw new Error("Failed to fetch members");
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      setError(err.message);
    }
  };

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

  // ✅ This function updates the DB and refreshes state
  const handleSubscribe = async (memberId, movieName, dateWatched) => {
    try {
      const res = await fetch(`http://localhost:3000/members/${memberId}/subscribe`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: movieName, date: dateWatched }),
      });

      if (!res.ok) throw new Error("Failed to add movie");

      // Refresh member from backend to reflect DB
      const updatedMember = await res.json();
      setMembers((prev) =>
        prev.map((m) => (m._id === memberId ? updatedMember : m))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to add movie");
      fetchMembers(); // fallback: reload all members
    }
  };

  const handleDeleteMember = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/members/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete member");
      setMembers((prev) => prev.filter((m) => m._id !== id));
      navigate("/SubscriptionPage");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleSelectMovie = (movieName) => {
    if (onMovieSelect) onMovieSelect(movieName);
  };

  // If members are passed via props
  useEffect(() => {
    if (membersProp) setMembers(membersProp);
  }, [membersProp]);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "10px" }}>
        {members.map((member) => (
          <MemberCard
            key={member._id}
            member={member}
            movies={movies}
            onSubscribe={handleSubscribe}
            onDelete={handleDeleteMember}
            onSelectMovie={handleSelectMovie}
          />
        ))}
      </div>
    </div>
  );
}
