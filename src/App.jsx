import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


import Navbar from "./components/Navbar";

import Home from "./components/Home";
import HomeFeatures from "./components/HomeFeatures";
import HomeExtra from "./components/HomeExtra";

import MyCloset from "./components/MyCloset";
import Weather from "./components/Weather";
import AIOutfit from "./components/AIOutfit";
import Favorites from "./components/Favorites";

import Login from "./components/Login";

import Footer from "./components/Footer";

import "./App.css";


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

    /* HTML */

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

      <div
        className={`app ${theme}-theme`}
      >


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


            {/* =====================================
                LOGIN
            ===================================== */}

            <Route
              path="/login"
              element={<Login />}
            />


          </Routes>

        </main>


        {/* =========================================
            FOOTER
        ========================================= */}

        <Footer />

      </div>

    </BrowserRouter>

  );
}


export default App;