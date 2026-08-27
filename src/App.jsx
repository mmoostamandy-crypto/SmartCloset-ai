import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./components/Home";
import HomeFeatures from "./components/HomeFeatures";
import HomeExtra from "./components/HomeExtra";

import MyCloset from "./components/MyCloset";
import Weather from "./components/Weather";
import AIOutfit from "./components/AIOutfit";
import Favorites from "./components/Favorites";

import Footer from "./components/Footer";

import "./App.css";


/* =====================================================
   PAGE TITLE
===================================================== */

function getPageTitle(pathname) {

  if (pathname === "/closet") {
    return "My Closet — SmartCloset";
  }

  if (pathname === "/weather") {
    return "Weather — SmartCloset";
  }

  if (pathname === "/ai-outfit") {
    return "AI Outfit — SmartCloset";
  }

  if (pathname === "/favorites") {
    return "My Favorites — SmartCloset";
  }

  return "SmartCloset";
}


/* =====================================================
   HOME PAGE
===================================================== */

function HomePage() {
  return (
    <>
      <Home />

      <HomeFeatures />

      <HomeExtra />
    </>
  );
}


/* =====================================================
   APP LAYOUT
===================================================== */

function AppLayout({
  theme,
  toggleTheme,
}) {

  const location = useLocation();


  /* ===================================================
     PAGE TITLE
  =================================================== */

  useEffect(() => {

    document.title = getPageTitle(
      location.pathname
    );

  }, [location.pathname]);


  return (

    <div className={`app ${theme}-theme`}>

      {/* =========================================
          NAVBAR
      ========================================= */}

      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
      />


      {/* =========================================
          MAIN
      ========================================= */}

      <main>

        <Routes>

          {/* =====================================
              HOME
          ===================================== */}

          <Route
            path="/"
            element={<HomePage />}
          />


          {/* =====================================
              MY CLOSET
          ===================================== */}

          <Route
            path="/closet"
            element={<MyCloset />}
          />


          {/* =====================================
              WEATHER
          ===================================== */}

          <Route
            path="/weather"
            element={<Weather />}
          />


          {/* =====================================
              AI OUTFIT
          ===================================== */}

          <Route
            path="/ai-outfit"
            element={<AIOutfit />}
          />


          {/* =====================================
              FAVORITES
          ===================================== */}

          <Route
            path="/favorites"
            element={<Favorites />}
          />

        </Routes>

      </main>


      {/* =========================================
          FOOTER
      ========================================= */}

      <Footer />

    </div>

  );

}


/* =====================================================
   APP
===================================================== */

function App() {

  /* ===================================================
     THEME
  =================================================== */

  const [theme, setTheme] = useState(() => {

    return (
      localStorage.getItem(
        "smartcloset-theme"
      ) || "light"
    );

  });


  /* ===================================================
     APPLY THEME
  =================================================== */

  useEffect(() => {

    /* HTML DATA THEME */

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );


    /* HTML CLASS */

    document.documentElement.classList.toggle(
      "dark-theme",
      theme === "dark"
    );

    document.documentElement.classList.toggle(
      "light-theme",
      theme === "light"
    );


    /* BODY CLASS */

    document.body.classList.toggle(
      "dark-theme",
      theme === "dark"
    );

    document.body.classList.toggle(
      "light-theme",
      theme === "light"
    );


    /* SAVE THEME */

    localStorage.setItem(
      "smartcloset-theme",
      theme
    );

  }, [theme]);


  /* ===================================================
     TOGGLE THEME
  =================================================== */

  const toggleTheme = () => {

    setTheme((currentTheme) => {

      return currentTheme === "light"
        ? "dark"
        : "light";

    });

  };


  /* ===================================================
     RENDER
  =================================================== */

  return (

    <BrowserRouter>

      <AppLayout
        theme={theme}
        toggleTheme={toggleTheme}
      />

    </BrowserRouter>

  );

}


export default App;