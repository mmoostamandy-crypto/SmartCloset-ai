import {
  Shirt,
  CloudSun,
  WandSparkles,
  Heart,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./HomeFeatures.css";

function HomeFeatures() {

  const navigate = useNavigate();

  return (
    <section className="home-features">

      <div className="features-heading">

        <span>
          Smart wardrobe experience
        </span>

        <h2>
          Everything you need to
          <br />
          <strong>
            dress with confidence.
          </strong>
        </h2>

        <p>
          Organize your wardrobe, check the weather, and let SmartCloset
          help you discover your next favorite outfit.
        </p>

      </div>


      <div className="feature-grid">

        {/* =========================
            MY CLOSET
        ========================= */}

        <div
          className="feature-card"
          onClick={() => navigate("/closet")}
          role="button"
          tabIndex={0}
        >

          <div className="feature-icon">
            <Shirt size={22} />
          </div>

          <h3>
            My Closet
          </h3>

          <p>
            Keep all your favorite clothes organized in one beautiful
            digital wardrobe.
          </p>

          <span className="feature-link">
            Open Closet →
          </span>

        </div>


        {/* =========================
            WEATHER
        ========================= */}

        <div
          className="feature-card"
          onClick={() => navigate("/weather")}
          role="button"
          tabIndex={0}
        >

          <div className="feature-icon">
            <CloudSun size={22} />
          </div>

          <h3>
            Weather
          </h3>

          <p>
            Tell SmartCloset today's weather and get clothing suggestions
            that match the conditions.
          </p>

          <span className="feature-link">
            Check Weather →
          </span>

        </div>


        {/* =========================
            AI OUTFIT
        ========================= */}

        <div
          className="feature-card"
          onClick={() => navigate("/ai-outfit")}
          role="button"
          tabIndex={0}
        >

          <div className="feature-icon">
            <WandSparkles size={22} />
          </div>

          <h3>
            AI Outfit
          </h3>

          <p>
            Get personalized outfit ideas using only the clothes already
            available in your closet.
          </p>

          <span className="feature-link">
            Try AI Stylist →
          </span>

        </div>


        {/* =========================
            FAVORITES
        ========================= */}

        <div className="feature-card">

          <div className="feature-icon">
            <Heart size={22} />
          </div>

          <h3>
            Favorites
          </h3>

          <p>
            Save the outfits you love and quickly find them again whenever
            you need inspiration.
          </p>

          <span className="feature-link">
            Your Saved Styles
          </span>

        </div>

      </div>

    </section>
  );
}

export default HomeFeatures;