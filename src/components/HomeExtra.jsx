import {
  Sparkles,
  Shirt,
  CloudSun,
  WandSparkles,
  ArrowRight,
  Check,
  Flower2,
  SparklesIcon,
  Crown,
  Heart,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import lavenderTop from "../assets/lavender-top.jpg";
import jeans from "../assets/jeans.jpg";
import whiteSneakers from "../assets/white-sneakers.jpg";
import jacket from "../assets/jacket.jpg";

import "./HomeExtra.css";


function HomeExtra() {

  const navigate = useNavigate();


  return (
    <>

      <section className="home-stats">

        <div>
          <strong>100%</strong>
          <span>Personalized</span>
        </div>

        <div>
          <strong>AI</strong>
          <span>Smart Styling</span>
        </div>

        <div>
          <strong>24/7</strong>
          <span>Style Inspiration</span>
        </div>

        <div>
          <strong>∞</strong>
          <span>Outfit Ideas</span>
        </div>

      </section>


      <section className="closet-preview">

        <div className="section-heading">

          <span>
            Your digital wardrobe
          </span>

          <h2>
            Everything in your closet,
            <br />
            <strong>
              in one beautiful place
            </strong>
          </h2>

          <p>
            Add the clothes you already own and
            turn your wardrobe into a simple
            organized digital closet.
          </p>

        </div>


        <div className="clothes-preview">

          <div className="clothing-card">

            <div className="clothing-image">

              <img
                src={lavenderTop}
                alt="Lavender top"
              />

            </div>

            <h3>
              Lavender Top
            </h3>

            <span>
              Top
            </span>

          </div>


          <div className="clothing-card">

            <div className="clothing-image">

              <img
                src={jeans}
                alt="Blue jeans"
              />

            </div>

            <h3>
              Classic Jeans
            </h3>

            <span>
              Bottom
            </span>

          </div>


          <div className="clothing-card">

            <div className="clothing-image">

              <img
                src={whiteSneakers}
                alt="White sneakers"
              />

            </div>

            <h3>
              White Sneakers
            </h3>

            <span>
              Shoes
            </span>

          </div>


          <div className="clothing-card">

            <div className="clothing-image">

              <img
                src={jacket}
                alt="Lavender jacket"
              />

            </div>

            <h3>
              Soft Jacket
            </h3>

            <span>
              Outerwear
            </span>

          </div>

        </div>


        <div className="section-action">

          <button
            type="button"
            className="cta-button"
            onClick={() =>
              navigate("/closet")
            }
          >

            Open My Closet

            <ArrowRight size={18} />

          </button>

        </div>

      </section>


      <section className="how-section">

        <div className="section-heading">

          <span>
            How it works
          </span>

          <h2>
            Your perfect outfit
            <br />
            <strong>
              In three simple steps
            </strong>
          </h2>

        </div>


        <div className="steps-grid">


          <div
            className="step-card"
            onClick={() =>
              navigate("/closet")
            }
            role="button"
            tabIndex={0}
          >

            <div className="step-number">
              01
            </div>

            <Shirt size={28} />

            <h3>
              Add Your Clothes
            </h3>

            <p>
              Build your digital wardrobe by
              adding the clothes you already own.
            </p>

          </div>


          <div
            className="step-card"
            onClick={() =>
              navigate("/weather")
            }
            role="button"
            tabIndex={0}
          >

            <div className="step-number">
              02
            </div>

            <CloudSun size={28} />

            <h3>
              Tell Us the Weather
            </h3>

            <p>
              Enter today's weather so
              SmartCloset can understand what
              your outfit needs.
            </p>

          </div>


          <div
            className="step-card"
            onClick={() =>
              navigate("/ai-outfit")
            }
            role="button"
            tabIndex={0}
          >

            <div className="step-number">
              03
            </div>

            <WandSparkles size={28} />

            <h3>
              Get Your Outfit
            </h3>

            <p>
              Our smart stylist creates an outfit
              using your available wardrobe.
            </p>

          </div>

        </div>

      </section>


      <section className="ai-preview">

        <div className="ai-preview-content">

          <div className="ai-badge">

            <Sparkles size={16} />

            AI PERSONAL STYLIST

          </div>


          <h2>

            Stop wondering
            <br />

            <strong>
              what to wear.
            </strong>

          </h2>


          <p>

            SmartCloset considers your wardrobe,
            weather and occasion to help you choose
            an outfit you will love.

          </p>


          <ul>

            <li>

              <Check size={17} />

              Uses clothes from your own closet

            </li>


            <li>

              <Check size={17} />

              Considers today's weather

            </li>


            <li>

              <Check size={17} />

              Creates simple outfit combinations

            </li>

          </ul>


          <button
            type="button"
            className="ai-button"
            onClick={() =>
              navigate("/ai-outfit")
            }
          >

            Try AI Stylist

            <ArrowRight size={18} />

          </button>

        </div>


        <div className="ai-preview-card">

          <div className="ai-card-top">

            <span>
              ✨ AI Recommendation
            </span>

            <span>
              Today
            </span>

          </div>


          <div className="ai-outfit-visual">

            <img
              src={jacket}
              alt="AI outfit recommendation"
            />

          </div>


          <h3>
            Soft Lavender Outfit
          </h3>


          <p>
            Lavender top + classic jeans +
            white sneakers
          </p>


          <div className="weather-pill">
            ☀️ 22°C · Perfect for today
          </div>

        </div>

      </section>


      <section className="style-section">

        <div className="section-heading">

          <span>
            Find your style
          </span>

          <h2>

            Dress the way
            <br />

            <strong>
              You feel.
            </strong>

          </h2>

        </div>


        <div className="style-grid">


          <div className="style-card">

            <span>

              <Flower2
                size={34}
                strokeWidth={1.7}
              />

            </span>

            <h3>
              Soft & Feminine
            </h3>

            <p>
              Elegant colors and gentle silhouettes.
            </p>

          </div>


          <div className="style-card">

            <span>

              <SparklesIcon
                size={34}
                strokeWidth={1.7}
              />

            </span>

            <h3>
              Minimal
            </h3>

            <p>
              Simple, clean and timeless outfits.
            </p>

          </div>


          <div className="style-card">

            <span>

              <Crown
                size={34}
                strokeWidth={1.7}
              />

            </span>

            <h3>
              Elegant
            </h3>

            <p>
              Polished looks for special moments.
            </p>

          </div>


          <div className="style-card">

            <span>

              <Heart
                size={34}
                strokeWidth={1.7}
              />

            </span>

            <h3>
              Casual
            </h3>

            <p>
              Comfortable outfits for everyday life.
            </p>

          </div>

        </div>

      </section>


      <section className="home-cta">

        <Sparkles size={30} />

        <h2>
          Your closet is waiting.
        </h2>

        <p>

          Start building your digital wardrobe
          and discover outfits made just for you.

        </p>


        <button
          type="button"
          className="cta-button"
          onClick={() =>
            navigate("/closet")
          }
        >

          Build My Closet

          <ArrowRight size={18} />

        </button>

      </section>

    </>
  );
}


export default HomeExtra;