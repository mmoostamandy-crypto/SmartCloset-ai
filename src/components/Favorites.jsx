import { useEffect, useMemo, useState } from "react";

import {
  Heart,
  Search,
  Shirt,
  Layers,
  Footprints,
  ShoppingBag,
  Trash2,
  X,
  Sparkles,
  Check,
} from "lucide-react";

import "./Favorites.css";

function Favorites() {
  // =====================================================
  // FAVORITES STATE
  // =====================================================

  const [favorites, setFavorites] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [activeFilter, setActiveFilter] =
    useState("All");

  const [message, setMessage] = useState("");

  // =====================================================
  // LOAD FAVORITES FROM CLOSET
  // =====================================================

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const saved = localStorage.getItem(
        "smartcloset-clothes"
      );

      if (!saved) {
        setFavorites([]);
        return;
      }

      const clothes = JSON.parse(saved);

      if (!Array.isArray(clothes)) {
        setFavorites([]);
        return;
      }

      const favoriteItems = clothes.filter(
        (item) => item.favorite === true
      );

      setFavorites(favoriteItems);
    } catch (error) {
      console.error(
        "Favorites loading error:",
        error
      );

      setFavorites([]);
    }
  };

  // =====================================================
  // FILTERS
  // =====================================================

  const filters = [
    {
      name: "All",
      icon: Heart,
    },
    {
      name: "Tops",
      icon: Shirt,
    },
    {
      name: "Bottoms",
      icon: Layers,
    },
    {
      name: "Shoes",
      icon: Footprints,
    },
    {
      name: "Outerwear",
      icon: ShoppingBag,
    },
  ];

  // =====================================================
  // FILTER FAVORITES
  // =====================================================

  const filteredFavorites = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    return favorites.filter((item) => {
      const name = String(
        item.name || ""
      ).toLowerCase();

      const category = String(
        item.category || ""
      ).toLowerCase();

      const matchesSearch =
        !search ||
        name.includes(search) ||
        category.includes(search);

      const matchesCategory =
        activeFilter === "All" ||
        item.category === activeFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    favorites,
    searchTerm,
    activeFilter,
  ]);

  // =====================================================
  // MESSAGE
  // =====================================================

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [message]);

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {
    setSearchTerm("");
  };

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const resetFilters = () => {
    setSearchTerm("");
    setActiveFilter("All");
  };

  // =====================================================
  // REMOVE FAVORITE
  // =====================================================

  const removeFavorite = (id) => {
    try {
      const saved = localStorage.getItem(
        "smartcloset-clothes"
      );

      if (!saved) return;

      const clothes = JSON.parse(saved);

      if (!Array.isArray(clothes)) return;

      const updatedClothes = clothes.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                favorite: false,
              }
            : item
      );

      localStorage.setItem(
        "smartcloset-clothes",
        JSON.stringify(updatedClothes)
      );

      const updatedFavorites =
        updatedClothes.filter(
          (item) => item.favorite === true
        );

      setFavorites(updatedFavorites);

      setMessage(
        "Removed from favorites."
      );
    } catch (error) {
      console.error(
        "Could not remove favorite:",
        error
      );

      setMessage(
        "Something went wrong."
      );
    }
  };// =====================================================
  // CATEGORY COUNTS
  // =====================================================

  const totalFavorites = favorites.length;

  const topsCount = favorites.filter(
    (item) => item.category === "Tops"
  ).length;

  const bottomsCount = favorites.filter(
    (item) => item.category === "Bottoms"
  ).length;

  const shoesCount = favorites.filter(
    (item) => item.category === "Shoes"
  ).length;

  const outerwearCount = favorites.filter(
    (item) => item.category === "Outerwear"
  ).length;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="favorites-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="favorites-header">

        <div className="favorites-header-content">

          <span className="favorites-label">
            YOUR FAVORITE ITEMS
          </span>

          <h1>
            My <strong>Favorites</strong>
          </h1>

          <p>
            Keep the clothing pieces you love
            most in one beautiful collection.
          </p>

        </div>

        <div className="favorites-header-icon">
          <Heart
            size={32}
            fill="currentColor"
          />
        </div>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="favorites-summary">

        <div className="favorites-summary-card">

          <div className="favorites-summary-icon">
            <Heart
              size={21}
              fill="currentColor"
            />
          </div>

          <div>
            <strong>
              {totalFavorites}
            </strong>

            <span>
              Total Favorites
            </span>
          </div>

        </div>


        <div className="favorites-summary-card">

          <div className="favorites-summary-icon">
            <Shirt size={21} />
          </div>

          <div>
            <strong>
              {topsCount}
            </strong>

            <span>
              Tops
            </span>
          </div>

        </div>


        <div className="favorites-summary-card">

          <div className="favorites-summary-icon">
            <Layers size={21} />
          </div>

          <div>
            <strong>
              {bottomsCount}
            </strong>

            <span>
              Bottoms
            </span>
          </div>

        </div>


        <div className="favorites-summary-card">

          <div className="favorites-summary-icon">
            <Footprints size={21} />
          </div>

          <div>
            <strong>
              {shoesCount}
            </strong>

            <span>
              Shoes
            </span>
          </div>

        </div>

      </div>


      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <div className="favorites-toolbar">

        {/* SEARCH */}

        <div className="favorites-search">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search your favorites..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

          {searchTerm && (
            <button
              type="button"
              className="favorites-clear-search"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

        </div>


        {/* FILTERS */}

        <div className="favorites-filters">

          {filters.map((filter) => {

            const Icon = filter.icon;

            return (
              <button
                key={filter.name}
                type="button"
                className={`favorites-filter ${
                  activeFilter === filter.name
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveFilter(
                    filter.name
                  )
                }
              >
                <Icon size={15} />

                {filter.name}
              </button>
            );

          })}

        </div>


        {/* RESET */}

        {(searchTerm ||
          activeFilter !== "All") && (

          <button
            type="button"
            className="favorites-reset"
            onClick={resetFilters}
          >
            <X size={15} />
            Reset
          </button>

        )}

      </div>


      {/* =================================================
          FAVORITES COUNT
      ================================================= */}

      {favorites.length > 0 && (

        <div className="favorites-result-info">

          <div>

            <Sparkles size={17} />

            <span>
              Showing{" "}
              <strong>
                {filteredFavorites.length}
              </strong>{" "}
              favorite{" "}
              {filteredFavorites.length === 1
                ? "item"
                : "items"}
            </span>

          </div>

        </div>

      )}


      {/* =================================================
          FAVORITES GRID
      ================================================= */}

      {filteredFavorites.length > 0 && (

        <div className="favorites-grid">

          {filteredFavorites.map((item) => (

            <article
              className="favorite-card"
              key={item.id}
            >

              {/* IMAGE */}

              <div className="favorite-card-image">

                {item.image ? (

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                ) : (

                  <div className="favorite-placeholder">

                    <Shirt size={45} />

                  </div>

                )}


                {/* FAVORITE BUTTON */}

                <button
                  type="button"
                  className="favorite-remove-btn"
                  onClick={() =>
                    removeFavorite(
                      item.id
                    )
                  }
                  aria-label={`Remove ${item.name} from favorites`}
                  title="Remove from favorites"
                >
                  <Heart
                    size={18}
                    fill="currentColor"
                  />
                </button>

              </div>


              {/* ITEM INFO */}

              <div className="favorite-card-info">

                <div>

                  <h3>
                    {item.name}
                  </h3>

                  <span>
                    {item.category}
                  </span>

                </div>

                <div className="favorite-badge">

                  <Heart
                    size={13}
                    fill="currentColor"
                  />

                  Favorite

                </div>

              </div>

            </article>

          ))}

        </div>

      )}{/* =================================================
          NO RESULTS
      ================================================= */}

      {favorites.length > 0 &&
        filteredFavorites.length === 0 && (

          <div className="favorites-empty">

            <div className="favorites-empty-icon">
              <Search size={32} />
            </div>

            <h2>
              No favorites found
            </h2>

            <p>
              We couldn't find any favorite items
              matching your search or filter.
            </p>

            <button
              type="button"
              className="favorites-reset-empty"
              onClick={resetFilters}
            >
              <X size={16} />
              Clear Filters
            </button>

          </div>

        )}


      {/* =================================================
          EMPTY FAVORITES
      ================================================= */}

      {favorites.length === 0 && (

        <div className="favorites-empty">

          <div className="favorites-empty-icon">
            <Heart size={40} />
          </div>

          <h2>
            No Favorites Yet
          </h2>

          <p>
            Your favorite clothing items will
            appear here when you save them from
            My Closet.
          </p>

        </div>

      )}


      {/* =================================================
          TOAST MESSAGE
      ================================================= */}

      {message && (

        <div className="favorites-message">

          <div className="favorites-message-icon">
            <Check size={17} />
          </div>

          <span>
            {message}
          </span>

        </div>

      )}

    </section>
  );
}

export default Favorites;