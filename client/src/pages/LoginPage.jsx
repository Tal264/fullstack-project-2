import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hoveredInput, setHoveredInput] = useState(""); // track which input is hovered
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        navigate("/main");
      } else {
        const errData = await res.json();
        setError(errData.message || "Login failed");
      }
    } catch (err) {
      setError("Server error, try again later.");
    }
  };

  // Inline tooltip style
  const tooltipStyle = {
  position: "absolute",
  backgroundColor: "#2196F3", // blue bubble
  color: "#fff",
  padding: "6px 10px",
  borderRadius: "8px",
  // top: "50%",
  left: "50%", // slightly further right
  transform: "translateY(-50%)",
  whiteSpace: "nowrap",
  fontSize: "13px",
  fontWeight: "500",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  zIndex: 1,
};


  const inputWrapperStyle = {
    position: "relative",
    marginBottom: "15px",
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <h1>Movies - Subscription Website</h1>
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <div
          style={inputWrapperStyle}
          onMouseEnter={() => setHoveredInput("username")}
          onMouseLeave={() => setHoveredInput("")}
        >
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {hoveredInput === "username" && (
            <div style={tooltipStyle}>admin</div>
          )}
        </div>

        <div
          style={inputWrapperStyle}
          onMouseEnter={() => setHoveredInput("password")}
          onMouseLeave={() => setHoveredInput("")}
        >
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {hoveredInput === "password" && (
            <div style={tooltipStyle}>admin123</div>
          )}
        </div>

        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
