import React, { useState, useEffect } from "react";
import MoviesPage from "./MoviesPage";

export default function MainPage() {
  const [loggedUser, setLoggedUser] = useState({ fullName: "Guest" });
  const [error, setError] = useState("");

  // Fetch logged-in user on mount
  useEffect(() => {
    const fetchLoggedUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/users/loggedin", {
          credentials: "include", // important for session cookie
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
    <div>
      {/* Main content of default page */}
      <MoviesPage />
    </div>
  );
}
