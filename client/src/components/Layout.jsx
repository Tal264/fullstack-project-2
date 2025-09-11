import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer";

export default function Layout() {
  const [loggedUser, setLoggedUser] = useState({ fullName: "Guest" });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("movies");
  const navigate = useNavigate();

   const handleNav = (path, tab) => {
    setActiveTab(tab);
    navigate(path);
  };

  // Fetch logged-in user on mount
  useEffect(() => {
    const fetchLoggedUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/users/loggedin", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch logged-in user");
        const data = await res.json();
        setLoggedUser(data);
      } catch (err) {
        console.error(err);
        setLoggedUser({ fullName: "Guest" });
        setError(err.message);
      }
    };
    fetchLoggedUser();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header + Top Navigation */}
      <header style={{ padding: "20px", marginBottom: "-10px" }}>
        <h1>Movies - Subscription Website</h1>
        <h3>
          Welcome, {loggedUser.fullName}{" "} 
          {error && <span style={{ color: "red" }}>({error})</span>}
        </h3> 
       <nav style={{ display: "flex", gap: "15px" }}>
      <button
        onClick={() => handleNav("/MoviesPage", "movies")}
        style={{ fontWeight: activeTab === "movies" ? "bold" : "normal" }}
      >
        Movies
      </button>
      <button
        onClick={() => handleNav("/SubscriptionPage", "subscription")}
        style={{ fontWeight: activeTab === "subscription" ? "bold" : "normal" }}
      >
        Subscription
      </button>
      <button
        onClick={() => handleNav("/AllUsersPage", "users")}
        style={{ fontWeight: activeTab === "users" ? "bold" : "normal" }}
      >
        User Management
      </button>
      <button
        onClick={() => handleNav("/logout", "logout")}
        style={{ fontWeight: activeTab === "logout" ? "bold" : "normal" }}
      >
        Log out
      </button>
    </nav>
      </header>
      {/* Main page content */}
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
