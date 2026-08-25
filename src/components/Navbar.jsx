import {
  Sparkles,
  Home,
  Shirt,
  CloudSun,
  WandSparkles,
  Heart,
  Moon,
  Sun,
  LogIn,
  UserPlus,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import "./Navbar.css";


function Navbar({ theme, toggleTheme }) {

  const navigate = useNavigate();


  const navLinkClass = ({ isActive }) =>
    isActive ? "active" : "";


  return (
    <header className="navbar">


      {/* =====================================
          LOGO
      ===================================== */}

      <div
        className="navbar-logo"
        onClick={() => navigate("/")}
        role="button"
        tabIndex={0}
      >

        <div className="logo-icon">
          <Sparkles size={21} />
        </div>

        <span>
          SmartCloset
        </span>

      </div>


      {/* =====================================
          NAVIGATION LINKS
      ===================================== */}

      <nav className="navbar-links">

        <NavLink
          to="/"
          className={navLinkClass}
        >
          <Home size={17} />
          <span>Home</span>
        </NavLink>


        <NavLink
          to="/closet"
          className={navLinkClass}
        >
          <Shirt size={17} />
          <span>My Closet</span>
        </NavLink>


        <NavLink
          to="/weather"
          className={navLinkClass}
        >
          <CloudSun size={17} />
          <span>Weather</span>
        </NavLink>


        <NavLink
          to="/ai-outfit"
          className={navLinkClass}
        >
          <WandSparkles size={17} />
          <span>AI Outfit</span>
        </NavLink>


        <NavLink
          to="/favorites"
          className={navLinkClass}
        >
          <Heart size={17} />
          <span>Favorites</span>
        </NavLink>

      </nav>


      {/* =====================================
          RIGHT ACTIONS
      ===================================== */}

      <div className="navbar-actions">


        {/* DARK / LIGHT MODE */}

        <button
          type="button"
          className="theme-button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={
            theme === "light"
              ? "Dark Mode"
              : "Light Mode"
          }
        >

          {theme === "light" ? (
            <Moon size={18} />
          ) : (
            <Sun size={18} />
          )}

        </button>


        {/* SIGN IN */}

        <button
          type="button"
          className="sign-in-button"
          onClick={() => navigate("/login")}
        >

          <LogIn size={17} />

          <span>
            Sign In
          </span>

        </button>


        {/* LOG IN */}

        <button
          type="button"
          className="sign-up-button"
          onClick={() => navigate("/login")}
        >

          <UserPlus size={17} />

          <span>
            Log In
          </span>

        </button>


      </div>

    </header>
  );
}


export default Navbar;