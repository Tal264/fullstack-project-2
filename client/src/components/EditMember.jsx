import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`http://localhost:3000/members/${id}`);
        if (!res.ok) throw new Error("Member not found");
        const data = await res.json();
        setMember(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMember();
  }, [id]);

  const handleUpdate = async () => {
    try {
      if (!member.name || !member.email || !member.city) {
        alert("All fields are required");
        return;
      }

      const res = await fetch(`http://localhost:3000/members/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member),
      });
      if (!res.ok) throw new Error("Failed to update member");
      const updatedMember = await res.json();

      // Navigate back to members list after update
      navigate("/members");
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!member) return <p>Loading member...</p>;

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "10px", height: "200px", width: "400px" }}>
      <h2>Edit Member</h2> 
      <div>
        <label>Name: </label>
        <input value={member.name} onChange={(e) => setMember({ ...member, name: e.target.value })} />
      </div>
      <div>
        <label>Email: </label>
        <input value={member.email} onChange={(e) => setMember({ ...member, email: e.target.value })} />
      </div>
      <div>
        <label>City: </label>
        <input value={member.city} onChange={(e) => setMember({ ...member, city: e.target.value })} />
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleUpdate}>Update</button>{" "}
        <button onClick={() => navigate("/SubscriptionPage")}>Cancel</button>
      </div>
    </div>
  );
}
