import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Pages
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import MoviesPage from "./pages/MoviesPage";
import AllMovies from "./pages/AllMoviesPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import AllMembersPage from "./pages/AllMembersPage";
import MemberPage from "./pages/MemberPage";
import EditMember from "./components/EditMember";
import EditMovie from "./components/EditMovie";
import AllUsersPage from "./pages/AllUsersPage";
import Logout from "./components/Logout";
import MoviePage from "./pages/MoviePage";

function App() {
  return (
    <Routes>
      {/* Routes with Layout: top navigation + footer */}
      <Route element={<Layout />}>
        <Route path="/main" element={<MainPage />} />

        {/* Movies */}
        <Route path="/movies" element={<AllMovies />} />
        <Route path="/movies/edit/:id" element={<EditMovie />} />
        <Route path="/movies/:id" element={<MoviePage />} />
        <Route path="/MoviesPage" element={<MoviesPage />} />

        {/* Subscriptions */}
        <Route path="/subscriptions" element={<SubscriptionPage />} />
        <Route path="/SubscriptionPage" element={<SubscriptionPage />} />

        {/* Members */}
        <Route path="/members" element={<AllMembersPage />} />
        <Route path="/members/:id" element={<MemberPage />} />
        <Route path="/members/edit/:id" element={<EditMember />} />

        {/* Users */}
        <Route path="/users" element={<AllUsersPage />} />
        <Route path="/AllUsersPage" element={<AllUsersPage />} />

        {/* Logout */}
        <Route path="/logout" element={<Logout />} />
      </Route>

      {/* Routes without Layout (no header/footer) */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
