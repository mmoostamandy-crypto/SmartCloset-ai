import { useEffect, useMemo, useState } from "react";

import {
  Sparkles,
  Shirt,
  Heart,
  RefreshCw,
  CloudSun,
  Thermometer,
  Check,
  WandSparkles,
  Info,
  AlertTriangle,
  Lightbulb,
  Palette,
  BriefcaseBusiness,
  MapPin,
  X,
} from "lucide-react";

import "./AIOutfit.css";


function AIOutfit() {

  // =====================================================
  // BASIC STATE
  // =====================================================

  const [clothes, setClothes] = useState([]);

  const [weather, setWeather] = useState(
    localStorage.getItem("smartcloset-weather") || "Sunny"
  );

  const [temperature, setTemperature] = useState(
    Number(
      localStorage.getItem("smartcloset-temperature") || 24
    )
  );

  const [outfit, setOutfit] = useState(null);

  const [isGenerating, setIsGenerating] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);

  const [message, setMessage] = useState("");

  const [errorType, setErrorType] = useState("");


  // =====================================================
  // AI PREFERENCES
  // =====================================================

  const [occasion, setOccasion] = useState("Everyday");

  const [style, setStyle] = useState("Any");

  const [color, setColor] = useState("Any");

  const [userRequest, setUserRequest] = useState("");


  // =====================================================
  // GENERATION CONTROL
  // =====================================================

  const [generationNumber, setGenerationNumber] = useState(0);

  const [previousOutfitIds, setPreviousOutfitIds] =
    useState([]);


  // =====================================================
  // LOAD CLOSET
  // =====================================================

  useEffect(() => {

    const loadCloset = () => {

      const savedClothes =
        localStorage.getItem(
          "smartcloset-clothes"
        );

      if (!savedClothes) {
        setClothes([]);
        return;
      }

      try {

        const parsed =
          JSON.parse(savedClothes);

        if (Array.isArray(parsed)) {
          setClothes(parsed);
        } else {
          setClothes([]);
        }

      } catch (error) {

        console.error(
          "SmartCloset: Could not load closet.",
          error
        );

        setClothes([]);

      }

    };

    loadCloset();

  }, []);


  // =====================================================
  // LISTEN FOR CLOSET CHANGES
  // =====================================================

  useEffect(() => {

    const handleStorageChange = () => {

      const savedClothes =
        localStorage.getItem(
          "smartcloset-clothes"
        );

      if (!savedClothes) {
        setClothes([]);
        return;
      }

      try {

        const parsed =
          JSON.parse(savedClothes);

        setClothes(
          Array.isArray(parsed)
            ? parsed
            : []
        );

      } catch {

        setClothes([]);

      }

    };


    window.addEventListener(
      "storage",
      handleStorageChange
    );


    return () => {

      window.removeEventListener(
        "storage",
        handleStorageChange
      );

    };

  }, []);


  // =====================================================
  // LOAD WEATHER
  // =====================================================

  useEffect(() => {

    const updateWeather = () => {

      const savedWeather =
        localStorage.getItem(
          "smartcloset-weather"
        );

      const savedTemperature =
        localStorage.getItem(
          "smartcloset-temperature"
        );


      setWeather(
        savedWeather || "Sunny"
      );


      setTemperature(
        Number(
          savedTemperature || 24
        )
      );

    };


    updateWeather();


    window.addEventListener(
      "storage",
      updateWeather
    );


    return () => {

      window.removeEventListener(
        "storage",
        updateWeather
      );

    };

  }, []);


  // =====================================================
  // CLOSET CATEGORIES
  // =====================================================

  const categoryItems = useMemo(() => {

    const getItems = (category) => {

      return clothes.filter(
        (item) =>
          String(item?.category || "")
            .trim()
            .toLowerCase() ===
          category.toLowerCase()
      );

    };


    return {

      tops: getItems("Tops"),

      bottoms: getItems("Bottoms"),

      shoes: getItems("Shoes"),

      outerwear: getItems("Outerwear"),

      dresses: getItems("Dresses"),

      accessories: getItems("Accessories"),

    };

  }, [clothes]);


  // =====================================================
  // WEATHER CONDITIONS
  // =====================================================

  const weatherLower =
    String(weather || "")
      .toLowerCase();


  const needsOuterwear =
    temperature <= 18 ||
    weatherLower.includes("cold") ||
    weatherLower.includes("rain");


  const warmWeather =
    temperature >= 27 &&
    (
      weatherLower.includes("sun") ||
      weatherLower.includes("clear")
    );


  const rainyWeather =
    weatherLower.includes("rain");


  // =====================================================
  // CLOSET SUMMARY
  // =====================================================

  const closetSummary = useMemo(() => {

    return {

      total: clothes.length,

      tops: categoryItems.tops.length,

      bottoms: categoryItems.bottoms.length,

      shoes: categoryItems.shoes.length,

      outerwear: categoryItems.outerwear.length,

      dresses: categoryItems.dresses.length,

      accessories:
        categoryItems.accessories.length,

    };

  }, [clothes, categoryItems]);


  // =====================================================
  // RESET MESSAGE
  // =====================================================

  const clearMessage = () => {

    setMessage("");

    setErrorType("");

  };


  // =====================================================
  // FIND CLOTHING ITEM
  // =====================================================

  const findClothing = (id) => {

    if (
      id === null ||
      id === undefined ||
      id === ""
    ) {

      return null;

    }


    return (
      clothes.find(
        (item) =>
          String(item?.id) ===
          String(id)
      ) || null
    );

  };


  // =====================================================
  // GET ITEM ID
  // =====================================================

  const getItemId = (item) => {

    if (!item) {
      return null;
    }

    return (
      item.id ??
      item._id ??
      item.uuid ??
      null
    );

  };


  // =====================================================
  // CREATE OUTFIT ID SIGNATURE
  // =====================================================

  const createOutfitSignature = (
    top,
    bottom,
    shoes,
    outerwear
  ) => {

    return [
      getItemId(top),
      getItemId(bottom),
      getItemId(shoes),
      getItemId(outerwear),
    ]
      .filter(
        (value) =>
          value !== null &&
          value !== undefined
      )
      .map(String)
      .join("-");

  };


  // =====================================================
  // GET WEATHER ADVICE
  // =====================================================

  const getWeatherAdvice = () => {

    if (rainyWeather) {

      return (
        "Rain is expected, so a practical " +
        "water-resistant layer and suitable shoes " +
        "would be a better choice."
      );

    }


    if (
      weatherLower.includes("cold") ||
      temperature <= 12
    ) {

      return (
        "It is cold outside. Warm layers should " +
        "be prioritized for comfort."
      );

    }


    if (temperature <= 18) {

      return (
        "The temperature is cool, so adding a " +
        "light or warm layer would be useful."
      );

    }


    if (warmWeather) {

      return (
        "It is warm outside. Light, breathable " +
        "pieces will keep the outfit comfortable."
      );

    }


    if (weatherLower.includes("cloud")) {

      return (
        "The weather is mild and cloudy. A balanced " +
        "look with a light layer can work well."
      );

    }


    return (
      "The current conditions allow for a flexible " +
      "everyday outfit."
    );

  };


  // =====================================================
  // VALIDATE CLOSET
  // =====================================================

  const validateCloset = () => {

    if (clothes.length === 0) {

      setErrorType("empty");

      setMessage(
        "Your closet is empty. Add some clothes before asking the AI stylist for an outfit."
      );

      return false;

    }


    if (
      categoryItems.tops.length === 0 ||
      categoryItems.bottoms.length === 0 ||
      categoryItems.shoes.length === 0
    ) {

      setErrorType("incomplete");

      setMessage(
        "Your closet needs at least one Top, Bottom, and Shoes before a complete outfit can be created."
      );

      return false;

    }


    return true;

  };


  // =====================================================
  // BUILD USER REQUEST
  // =====================================================

  const buildUserRequest = () => {

    const request =
      userRequest.trim();


    if (request) {
      return request;
    }


    return (
      "Create a stylish complete outfit " +
      "that fits my preferences and today's weather."
    );

  };


  // =====================================================
  // BUILD REGENERATION REQUEST
  // =====================================================

  const buildRegenerationRequest = () => {

    const previousItems = outfit
      ? [
          outfit.top?.name,
          outfit.bottom?.name,
          outfit.shoes?.name,
          outfit.outerwear?.name,
        ]
          .filter(Boolean)
          .join(", ")
      : "No previous outfit";


    return `
Create a noticeably DIFFERENT outfit.

This is regeneration attempt #${generationNumber + 1}.

Previous outfit items:
${previousItems}

Do not simply repeat the same combination.

Prefer different clothing items from the user's closet when possible.

Keep the outfit appropriate for:
Occasion: ${occasion}
Style: ${style}
Color: ${color}
Weather: ${weather}
Temperature: ${temperature}°C

Original user request:
${buildUserRequest()}
`;

  };


  // =====================================================
  // START GENERATION
  // =====================================================

  const startGeneration = async (
    regenerate = false
  ) => {

    clearMessage();


    if (!validateCloset()) {
      return;
    }


    setIsGenerating(true);


    try {

      const nextGeneration =
        generationNumber + 1;


      setGenerationNumber(
        nextGeneration
      );


      const requestText =
        regenerate
          ? buildRegenerationRequest()
          : buildUserRequest();


      // =================================================
      // BACKEND REQUEST
      // =================================================

      const response = await fetch(
        "http://localhost:5000/api/ai-outfit",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            clothes,

            weather,

            temperature,

            occasion,

            style,

            color,

            userRequest:
              requestText,

            previousOutfitIds,

            generationNumber:
              nextGeneration,

          }),

        }
      );


      let data;


      try {

        data =
          await response.json();

      } catch {

        throw new Error(
          "The AI server returned an invalid response."
        );

      }


      if (
        !response.ok ||
        !data?.success
      ) {

        throw new Error(
          data?.message ||
          "The AI server could not create an outfit."
        );

      }


      // =================================================
      // AI RESULT
      // =================================================

      const aiResult =
        data.data || {};


      const aiOutfit =
        aiResult.outfit || {};


      // =================================================
      // SAVE FOR NEXT REGENERATION
      // =================================================

      const selectedTop =
        findClothing(
          aiOutfit.topId
        );


      const selectedBottom =
        findClothing(
          aiOutfit.bottomId
        );


      const selectedShoes =
        findClothing(
          aiOutfit.shoesId
        );


      const selectedOuterwear =
        findClothing(
          aiOutfit.outerwearId
        );


      const signature =
        createOutfitSignature(
          selectedTop,
          selectedBottom,
          selectedShoes,
          selectedOuterwear
        );


      // =================================================
      // COMPLETE OUTFIT VALIDATION
      // =================================================

      if (
        !selectedTop ||
        !selectedBottom ||
        !selectedShoes
      ) {

        throw new Error(
          "The AI could not select a complete outfit from your current closet. Please add more clothing items or try again."
        );

      }


      // =================================================
      // CREATE FINAL OUTFIT
      // =================================================

      const newOutfit = {

        id: Date.now(),

        signature,

        top:
          selectedTop,

        bottom:
          selectedBottom,

        shoes:
          selectedShoes,

        outerwear:
          selectedOuterwear,

        weather,

        temperature,

        occasion,

        style,

        color,

        title:
          aiResult.title ||
          "Your AI Outfit",

        description:
          aiResult.description ||
          "A personalized outfit created from your wardrobe.",

        whyItWorks:
          aiResult.whyItWorks ||
          "",

        recommendation:
          aiResult.recommendation ||
          "",

        styleWarning:
          aiResult.styleWarning ||
          "",

        stylingTips:
          Array.isArray(
            aiResult.stylingTips
          )
            ? aiResult.stylingTips
            : [],

        weatherAdvice:
          aiResult.weatherAdvice ||
          getWeatherAdvice(),

        missingItems:
          Array.isArray(
            aiResult.missingItems
          )
            ? aiResult.missingItems
            : [],

        colorAdvice:
          aiResult.colorAdvice ||
          "",

        createdAt:
          new Date().toISOString(),

      };


      // =================================================
      // TRACK PREVIOUS COMBINATIONS
      // =================================================

      setPreviousOutfitIds(
        (previous) => {

          const updated = [
            ...previous,
            signature,
          ];

          return [
            ...new Set(updated),
          ].slice(-10);

        }
      );


      setOutfit(
        newOutfit
      );


      setIsFavorite(false);

      setMessage("");

    } catch (error) {

      console.error(
        "SmartCloset AI error:",
        error
      );


      setErrorType("api");


      setMessage(
        error?.message ||
        "Could not connect to the AI server. Make sure the Groq server is running on port 5000."
      );

    } finally {

      setIsGenerating(false);

    }

  };


  // =====================================================
  // GENERATE FIRST OUTFIT
  // =====================================================

  const handleGenerate = () => {

    startGeneration(false);

  };


  // =====================================================
  // GENERATE AGAIN
  // =====================================================

  const handleGenerateAgain = () => {

    startGeneration(true);

  };


  // =====================================================
  // CREATE ANOTHER OUTFIT
  // =====================================================

  const handleCreateAnother = () => {

    setOutfit(null);

    setIsFavorite(false);

    setGenerationNumber(0);

    setPreviousOutfitIds([]);

    setUserRequest("");

    clearMessage();

    window.scrollTo({
      top:
        document.getElementById(
          "ai-outfit"
        )?.offsetTop || 0,

      behavior: "smooth",

    });

  };


  // =====================================================
  // FAVORITE
  // =====================================================

  const handleFavorite = () => {

    if (!outfit) {
      return;
    }


    const saved =
      localStorage.getItem(
        "smartcloset-favorite-outfits"
      );


    let favorites = [];


    if (saved) {

      try {

        const parsed =
          JSON.parse(saved);

        if (Array.isArray(parsed)) {
          favorites = parsed;
        }

      } catch {

        favorites = [];

      }

    }


    const exists =
      favorites.some(
        (item) =>
          String(item.id) ===
          String(outfit.id)
      );


    if (exists) {

      favorites =
        favorites.filter(
          (item) =>
            String(item.id) !==
            String(outfit.id)
        );

      setIsFavorite(false);

      setMessage(
        "Outfit removed from your favorites."
      );

    } else {

      favorites.push(
        outfit
      );

      setIsFavorite(true);

      setMessage(
        "Outfit saved to your favorites."
      );

    }


    localStorage.setItem(
      "smartcloset-favorite-outfits",
      JSON.stringify(favorites)
    );

  };


  // =====================================================
  // SAFE STYLING TIPS
  // =====================================================

  const getStylingTips = () => {

    if (
      !outfit ||
      !Array.isArray(
        outfit.stylingTips
      )
    ) {

      return [];

    }


    return outfit.stylingTips
      .filter(
        (tip) =>
          typeof tip === "string" &&
          tip.trim()
      )
      .slice(0, 6);

  };


  // =====================================================
  // EMPTY CLOSET
  // =====================================================

  if (clothes.length === 0) {

    return (

      <section
        className="ai-outfit-section"
        id="ai-outfit"
      >

        <div className="ai-outfit-header">

          <span className="ai-outfit-label">
            GROQ AI STYLIST
          </span>

          <h1>
            Your AI{" "}
            <strong>Outfit</strong>
          </h1>

          <p>
            Your personal AI stylist uses
            your wardrobe and current
            conditions to build a complete
            look.
          </p>

        </div>


        <div className="ai-empty-state">

          <div className="ai-empty-icon">

            <Shirt size={42} />

          </div>


          <h2>
            Your closet is empty
          </h2>


          <p>
            Add some clothing items to
            My Closet first. Then Groq AI
            can use those pieces to create
            personalized outfits.
          </p>

        </div>

      </section>

    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <section
      className="ai-outfit-section"
      id="ai-outfit"
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="ai-outfit-header">

        <span className="ai-outfit-label">
          GROQ AI STYLIST
        </span>

        <h1>
          Your AI{" "}
          <strong>Outfit</strong>
        </h1>

        <p>
          Tell your AI stylist what you
          want. It will analyze your closet,
          weather, occasion, colors and style
          preferences before making a recommendation.
        </p>

      </div>


      {/* =================================================
          WEATHER CONTEXT
      ================================================= */}

      <div className="ai-weather-context">

        <div className="ai-weather-context-item">

          <div className="ai-context-icon">

            <CloudSun size={20} />

          </div>

          <div>

            <span>
              Weather
            </span>

            <strong>
              {weather}
            </strong>

          </div>

        </div>


        <div className="ai-weather-context-item">

          <div className="ai-context-icon">

            <Thermometer size={20} />

          </div>

          <div>

            <span>
              Temperature
            </span>

            <strong>
              {temperature}°C
            </strong>

          </div>

        </div>


        <div className="ai-weather-advice">

          <Info size={18} />

          <span>
            {getWeatherAdvice()}
          </span>

        </div>

      </div>


      {/* =================================================
          GENERATOR
      ================================================= */}

      {!outfit && (

        <div className="ai-generator-card">

          <div className="ai-generator-icon">

            <Sparkles size={36} />

          </div>


          <h2>
            What should I wear?
          </h2>


          <p>
            Choose your preferences and let
            Groq create a personalized look
            from your own wardrobe.
          </p>


          {/* OCCASION */}

          <div className="ai-option-group">

            <label>
              <BriefcaseBusiness
                size={15}
              />

              Occasion
            </label>


            <div className="ai-options">

              {[
                "Everyday",
                "Work",
                "Party",
                "Date",
                "Travel",
                "Sport",
              ].map((item) => (

                <button
                  key={item}
                  type="button"
                  className={
                    occasion === item
                      ? "ai-option active"
                      : "ai-option"
                  }
                  onClick={() =>
                    setOccasion(item)
                  }
                >
                  {item}
                </button>

              ))}

            </div>

          </div>


          {/* STYLE */}

          <div className="ai-option-group">

            <label>

              <WandSparkles
                size={15}
              />

              Style

            </label>


            <div className="ai-options">

              {[
                "Any",
                "Elegant",
                "Minimal",
                "Classic",
                "Streetwear",
                "Cozy",
              ].map((item) => (

                <button
                  key={item}
                  type="button"
                  className={
                    style === item
                      ? "ai-option active"
                      : "ai-option"
                  }
                  onClick={() =>
                    setStyle(item)
                  }
                >
                  {item}
                </button>

              ))}

            </div>

          </div>


          {/* COLOR */}

          <div className="ai-option-group">

            <label>

              <Palette size={15} />

              Color Preference

            </label>


            <select
              value={color}
              onChange={(e) =>
                setColor(
                  e.target.value
                )
              }
              className="ai-select"
            >

              <option value="Any">
                Any Color
              </option>

              <option value="Black">
                Black
              </option>

              <option value="White">
                White
              </option>

              <option value="Purple">
                Purple
              </option>

              <option value="Blue">
                Blue
              </option>

              <option value="Beige">
                Beige
              </option>

              <option value="Pink">
                Pink
              </option>

              <option value="Green">
                Green
              </option>

            </select>

          </div>


          {/* USER REQUEST */}

          <div className="ai-request-group">

            <label>

              <Lightbulb size={15} />

              Tell your AI stylist

            </label>


            <textarea
              value={userRequest}
              onChange={(e) =>
                setUserRequest(
                  e.target.value
                )
              }
              placeholder="Example: I want something elegant but comfortable for a dinner..."
              rows={4}
            />

          </div>


          {/* CLOSET SUMMARY */}

          <div className="ai-closet-summary">

            <div>

              <Shirt size={17} />

              <span>
                {closetSummary.total}
                {" "}items
              </span>

            </div>


            <div>
              Tops: {closetSummary.tops}
            </div>


            <div>
              Bottoms: {closetSummary.bottoms}
            </div>


            <div>
              Shoes: {closetSummary.shoes}
            </div>

          </div>


          {/* FEATURES */}

          <div className="ai-generator-features">

            <div>

              <Shirt size={20} />

              <span>
                Your Closet
              </span>

            </div>


            <div>

              <CloudSun size={20} />

              <span>
                Weather
              </span>

            </div>


            <div>

              <WandSparkles size={20} />

              <span>
                Groq AI
              </span>

            </div>

          </div>


          {/* GENERATE */}

          <button
            type="button"
            className="generate-ai-button"
            onClick={handleGenerate}
            disabled={isGenerating}
          >

            {isGenerating ? (

              <>
                <RefreshCw
                  size={18}
                  className="spin-icon"
                />

                Groq is analyzing your wardrobe...

              </>

            ) : (

              <>
                <Sparkles size={18} />

                Generate Outfit

              </>

            )}

          </button>

        </div>

      )}

      {/*      {/* =========================
          AI STYLING ANALYSIS
      ========================= */}

      {outfit && (
        <div className="ai-styling-analysis">

          <div className="analysis-header">
            <div className="analysis-icon">
              <WandSparkles size={22} />
            </div>

            <div>
              <span>AI STYLE ANALYSIS</span>

              <h3>
                Why this outfit works
              </h3>
            </div>
          </div>

          <div className="analysis-content">

            {outfit.whyItWorks ? (
              <p>
                {outfit.whyItWorks}
              </p>
            ) : (
              <p>
                This combination was selected
                based on your wardrobe, weather,
                occasion and preferred style.
              </p>
            )}

          </div>

        </div>
      )}


      {/* =========================
          STYLE TIPS
      ========================= */}

      {outfit &&
        Array.isArray(outfit.stylingTips) &&
        outfit.stylingTips.length > 0 && (

          <div className="ai-styling-tips">

            <div className="tips-header">

              <div className="tips-icon">
                <Sparkles size={20} />
              </div>

              <div>
                <span>SMART TIPS</span>

                <h3>
                  How to wear it
                </h3>
              </div>

            </div>


            <div className="tips-list">

              {outfit.stylingTips.map(
                (tip, index) => (

                  <div
                    className="tip-item"
                    key={index}
                  >

                    <div className="tip-number">
                      {index + 1}
                    </div>

                    <p>
                      {tip}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

        )}


      {/* =========================
          WEATHER RECOMMENDATION
      ========================= */}

      {outfit &&
        outfit.weatherAdvice && (

          <div className="ai-weather-recommendation">

            <div className="weather-recommendation-icon">
              <CloudSun size={21} />
            </div>

            <div>

              <span>
                WEATHER RECOMMENDATION
              </span>

              <p>
                {outfit.weatherAdvice}
              </p>

            </div>

          </div>

        )}


      {/* =========================
          MISSING ITEMS
      ========================= */}

      {outfit &&
        Array.isArray(outfit.missingItems) &&
        outfit.missingItems.length > 0 && (

          <div className="ai-missing-items">

            <div className="missing-header">

              <div className="missing-icon">
                <Info size={20} />
              </div>

              <div>

                <span>
                  OPTIONAL ADDITIONS
                </span>

                <h3>
                  You could improve this look
                </h3>

              </div>

            </div>


            <p className="missing-description">
              Your current wardrobe works for
              this outfit, but the AI stylist
              recommends these additional items
              if you want to make the look even
              better:
            </p>


            <div className="missing-list">

              {outfit.missingItems.map(
                (item, index) => (

                  <div
                    className="missing-item"
                    key={index}
                  >

                    <span>
                      {item}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        )}


      {/* =========================
          OUTFIT SUMMARY
      ========================= */}

      {outfit && (

        <div className="ai-outfit-summary">

          <div className="summary-header">

            <div className="summary-icon">
              <Check size={20} />
            </div>

            <div>

              <span>
                SMARTCLOSET SUMMARY
              </span>

              <h3>
                Your complete look
              </h3>

            </div>

          </div>


          <div className="summary-grid">

            <div className="summary-item">

              <span>
                Occasion
              </span>

              <strong>
                {outfit.occasion ||
                  "Everyday"}
              </strong>

            </div>


            <div className="summary-item">

              <span>
                Style
              </span>

              <strong>
                {outfit.style ||
                  "Any"}
              </strong>

            </div>


            <div className="summary-item">

              <span>
                Color
              </span>

              <strong>
                {outfit.color ||
                  "Any"}
              </strong>

            </div>


            <div className="summary-item">

              <span>
                Weather
              </span>

              <strong>
                {outfit.weather ||
                  "Unknown"}
              </strong>

            </div>


            <div className="summary-item">

              <span>
                Temperature
              </span>

              <strong>
                {outfit.temperature}°C
              </strong>

            </div>

          </div>

        </div>

      )}


      {/* =========================
          USER FEEDBACK / NEW REQUEST
      ========================= */}

      {outfit && (

        <div className="ai-refinement-card">

          <div className="refinement-header">

            <div className="refinement-icon">
              <Send size={20} />
            </div>

            <div>

              <span>
                REFINE YOUR OUTFIT
              </span>

              <h3>
                Want something different?
              </h3>

            </div>

          </div>


          <p>
            Tell your AI stylist what you want
            to change and generate a new
            recommendation.
          </p>


          <textarea
            value={userRequest}
            onChange={(e) =>
              setUserRequest(
                e.target.value
              )
            }
            placeholder="Example: Make it more elegant, use purple, choose a different top, or make it better for a party..."
            rows={4}
          />


          <div className="refinement-actions">

            <button
              className="refine-button"
              onClick={() =>
                generateOutfit(true)
              }
              disabled={isGenerating}
            >

              {isGenerating ? (
                <>
                  <RefreshCw
                    size={17}
                    className="spin-icon"
                  />

                  AI is thinking...
                </>
              ) : (
                <>
                  <Send size={17} />

                  Update Outfit
                </>
              )}

            </button>


            
          </div>

        </div>

      )}


      {/* =========================
          CREATE COMPLETELY NEW OUTFIT
      ========================= */}

      {outfit && (

        <div className="new-outfit-section">

          <div className="new-outfit-content">

            <div className="new-outfit-icon">
              <Sparkles size={24} />
            </div>

            <div>

              <h3>
                Want a completely different look?
              </h3>

              <p>
                Start fresh and choose new
                preferences for another outfit.
              </p>

            </div>

          </div>


          <button
            className="bottom-generate-button"
            onClick={
              createAnotherOutfit
            }
          >

            <RefreshCw size={18} />

            Create Another Outfit

          </button>

        </div>

      )}


      {/* =========================
          STATUS MESSAGE
      ========================= */}

      {message && (

        <div
          className={
            message
              .toLowerCase()
              .includes("saved")
              ? "ai-message success"
              : "ai-message"
          }
        >

          <Info size={17} />

          <span>
            {message}
          </span>

        </div>

      )}

    </section>
  );
}

export default AIOutfit;