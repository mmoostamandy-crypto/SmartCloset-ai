import {
  Sparkles,
  ArrowRight,
  Shirt,
  Heart,
  CloudSun,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import fashionImage from "../assets/fashion-girl.png";

import "./Home.css";


function Home() {

  const navigate = useNavigate();


  // =========================================
  // REAL CLOSET ITEMS
  // =========================================

  const getClosetCount = () => {

    try {

      const savedClothes =
        localStorage.getItem(
          "smartcloset-clothes"
        );

      if (!savedClothes) {
        return 0;
      }

      const clothes =
        JSON.parse(savedClothes);

      return Array.isArray(clothes)
        ? clothes.length
        : 0;

    } catch (error) {

      console.error(
        "Could not read closet:",
        error
      );

      return 0;
    }
  };


  // =========================================
  // REAL FAVORITES
  // =========================================

  const getFavoriteCount = () => {

    try {

      const savedFavorites =
        localStorage.getItem(
          "smartcloset-favorite-outfits"
        );

      if (!savedFavorites) {
        return 0;
      }

      const favorites =
        JSON.parse(savedFavorites);

      return Array.isArray(favorites)
        ? favorites.length
        : 0;

    } catch (error) {

      console.error(
        "Could not read favorites:",
        error
      );

      return 0;
    }
  };


  // =========================================
  // WEATHER
  // =========================================

  const weather =
    localStorage.getItem(
      "smartcloset-weather"
    ) || "Sunny";


  const temperature =
    Number(
      localStorage.getItem(
        "smartcloset-temperature"
      ) || 24
    );


  // =========================================
  // DATA
  // =========================================

  const closetCount =
    getClosetCount();

  const favoriteCount =
    getFavoriteCount();


  // =========================================
  // RENDER
  // =========================================

  return (

    <section
      className="home"
      id="home"
    >

      {/* =====================================
          LEFT CONTENT
      ===================================== */}

      <div className="home-content">


        {/* BADGE */}

        <div className="home-badge">

          <Sparkles size={16} />

          <span>
            AI-Powered Personal Stylist
          </span>

        </div>


        {/* TITLE */}

        <h1>

          Your Wardrobe.
          <br />

          <span>
            Your Style.
          </span>

        </h1>


        {/* DESCRIPTION */}

        <p>

          Discover beautiful outfits from the
          clothes you already own. Let
          SmartCloset help you choose what to
          wear based on your weather, style,
          and occasion.

        </p>


        {/* =================================
            MAIN BUTTON
        ================================= */}

        <div className="home-buttons">

          <button
            type="button"
            className="primary-home-button"
            onClick={() =>
              navigate("/closet")
            }
          >

            <Shirt size={18} />

            Build My Closet

            <ArrowRight size={18} />

          </button>

        </div>


        {/* =================================
            REAL QUICK STATS
        ================================= */}

        <div className="home-quick-stats">


          {/* CLOSET */}

          <div
            className="home-stat"
            onClick={() =>
              navigate("/closet")
            }
            role="button"
            tabIndex={0}
          >

            <div className="home-stat-icon">

              <Shirt size={20} />

            </div>


            <div>

              <strong>
                {closetCount}
              </strong>

              <span>
                Closet Items
              </span>

            </div>

          </div>


          {/* FAVORITES */}

          <div
            className="home-stat"
          >

            <div className="home-stat-icon">

              <Heart size={20} />

            </div>


            <div>

              <strong>
                {favoriteCount}
              </strong>

              <span>
                Favorite Outfits
              </span>

            </div>

          </div>


          {/* WEATHER */}

          <div
            className="home-stat"
            onClick={() =>
              navigate("/weather")
            }
            role="button"
            tabIndex={0}
          >

            <div className="home-stat-icon">

              <CloudSun size={20} />

            </div>


            <div>

              <strong>
                {temperature}°C
              </strong>

              <span>
                {weather}
              </span>

            </div>

          </div>


        </div>

      </div>


      {/* =====================================
          RIGHT VISUAL
      ===================================== */}

      <div className="home-visual">


        {/* GLOW */}

        <div className="visual-glow"></div>


        {/* FASHION CARD */}

        <div className="fashion-card">


          {/* CARD HEADER */}

          <div className="fashion-card-header">

            <span>
              Today's Look
            </span>

            <Sparkles size={18} />

          </div>


          {/* IMAGE */}

          <div className="fashion-image">

            <img
              src={fashionImage}
              alt="SmartCloset fashion outfit"
            />

          </div>


          {/* INFO */}

          <div className="fashion-info">

            <div className="fashion-title-row">

              <div>

                <h3>
                  Soft Lavender Look
                </h3>

                <p>
                  Perfect for your day
                </p>

              </div>

              <Sparkles
                size={20}
              />

            </div>

          </div>

        </div>

      </div>

    </section>

  );
}


export default Home;