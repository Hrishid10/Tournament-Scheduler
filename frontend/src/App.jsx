import { Routes, Route, NavLink } from "react-router-dom";
import Admin from "./pages/Admin";
import PublicView from "./pages/PublicView";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div>
      <nav className="navbar">
        <div className="navLeft">
          <span className="logo">🏆 Tournament Management</span>
        </div>

        <div className="navRight">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "navLink activeLink" : "navLink"
            }
          >
            Admin
          </NavLink>

          <NavLink
            to="/public"
            className={({ isActive }) =>
              isActive ? "navLink activeLink" : "navLink"
            }
          >
            Public View
          </NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/public" element={<PublicView />} />
      </Routes>
    </div>
  );
}
