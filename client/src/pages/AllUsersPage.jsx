import React, { useEffect, useState } from "react";

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ fullName: "", username: "", password: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const method = editingUser ? "PUT" : "POST";
      const url = editingUser
        ? `http://localhost:3000/users/${editingUser._id}`
        : "http://localhost:3000/users";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save user");
      const savedUser = await res.json();

      if (editingUser) {
        // Update local state immediately
        setUsers((prev) =>
          prev.map((u) => (u._id === editingUser._id ? savedUser : u))
        );
      } else {
        // For new users, add to list
        setUsers((prev) => [...prev, savedUser]);
      }

      // Reset form
      setForm({ fullName: "", username: "", password: "" });
      setEditingUser(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      fullName: user.fullName, // use camelCase
      username: user.username,
      password: user.password,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
     <div style={{ border: "1px solid #ccc",
            borderRadius: "10px",
            width: "1350px",
            height: "100%",
            padding: "20px",
            position: "relative"
           }}>
      <h2>Users Management</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>{editingUser ? "Update" : "Add User"}</button>
        {editingUser && (
          <button
            onClick={() => {
              setEditingUser(null);
              setForm({ fullName: "", username: "", password: "" });
            }}
          >
            Cancel
          </button>
        )}
      </div>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Full Name</th>
            <th>Username</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={u._id}>
              <td>{idx + 1}</td>
              <td>{u.fullName}</td> 
              <td>{u.username}</td>
              <td>{u.password}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Edit</button> &nbsp;
                <button style={{ color: "red" }} onClick={() => handleDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
