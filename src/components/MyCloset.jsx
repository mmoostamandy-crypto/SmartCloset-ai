import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Search,
  Shirt,
  Footprints,
  Layers,
  ShoppingBag,
  X,
  Trash2,
  ImagePlus,
  Pencil,
  Heart,
  AlertTriangle,
  Check,
  Filter,
} from "lucide-react";

import lavenderTop from "../assets/lavender-top.jpg";
import jeans from "../assets/jeans.jpg";
import whiteSneakers from "../assets/white-sneakers.jpg";
import jacket from "../assets/jacket.jpg";

import "./MyCloset.css";

function MyCloset() {

  // =====================================================
  // DEFAULT CLOSET ITEMS
  // =====================================================

  const defaultClothes = [
    {
      id: 1,
      name: "Lavender Top",
      category: "Tops",
      image: lavenderTop,
      favorite: false,
    },
    {
      id: 2,
      name: "Classic Jeans",
      category: "Bottoms",
      image: jeans,
      favorite: false,
    },
    {
      id: 3,
      name: "White Sneakers",
      category: "Shoes",
      image: whiteSneakers,
      favorite: false,
    },
    {
      id: 4,
      name: "Soft Jacket",
      category: "Outerwear",
      image: jacket,
      favorite: false,
    },
  ];

  // =====================================================
  // CLOSET STATE
  // =====================================================

  const [clothes, setClothes] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "smartcloset-clothes"
      );

      if (!saved) {
        return defaultClothes;
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        return defaultClothes;
      }

      return parsed.map((item) => ({
        ...item,
        favorite: Boolean(item.favorite),
      }));
    } catch (error) {
      console.error(
        "Error loading SmartCloset items:",
        error
      );

      return defaultClothes;
    }
  });

  // =====================================================
  // FORM STATE
  // =====================================================

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");

  const [category, setCategory] = useState("Tops");

  const [imagePreview, setImagePreview] = useState(null);

  const [editingId, setEditingId] = useState(null);

  // =====================================================
  // SEARCH / FILTER STATE
  // =====================================================

  const [searchTerm, setSearchTerm] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");

  const [showFavoritesOnly, setShowFavoritesOnly] =
    useState(false);

  // =====================================================
  // DELETE STATE
  // =====================================================

  const [deleteId, setDeleteId] = useState(null);

  // =====================================================
  // MESSAGE STATE
  // =====================================================

  const [message, setMessage] = useState("");

  // =====================================================
  // SAVE CLOSET TO LOCAL STORAGE
  // =====================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        "smartcloset-clothes",
        JSON.stringify(clothes)
      );
    } catch (error) {
      console.error(
        "Error saving SmartCloset items:",
        error
      );
    }
  }, [clothes]);

  // =====================================================
  // SAVE DATA FOR AI OUTFIT
  // =====================================================

  useEffect(() => {
    try {
      const aiClosetData = clothes.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        image: item.image || null,
        favorite: Boolean(item.favorite),
      }));

      localStorage.setItem(
        "smartcloset-ai-closet",
        JSON.stringify(aiClosetData)
      );
    } catch (error) {
      console.error(
        "Error preparing AI closet data:",
        error
      );
    }
  }, [clothes]);

  // =====================================================
  // CLEAR TOAST MESSAGE
  // =====================================================

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage(
        "Image must be smaller than 5MB."
      );
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.onerror = () => {
      setMessage("Could not read the image.");
    };

    reader.readAsDataURL(file);
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const openAddForm = () => {
    setEditingId(null);
    setName("");
    setCategory("Tops");
    setImagePreview(null);
    setShowForm(true);
    setMessage("");
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const handleEditItem = (item) => {
    setEditingId(item.id);
    setName(item.name || "");
    setCategory(item.category || "Tops");
    setImagePreview(item.image || null);
    setShowForm(true);
    setMessage("");
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setName("");
    setCategory("Tops");
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  // =====================================================
  // ADD / EDIT ITEM
  // =====================================================

  const handleAddItem = (event) => {
    event.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      setMessage(
        "Please enter a clothing name."
      );
      return;
    }

    // EDIT EXISTING ITEM
    if (editingId !== null) {
      setClothes((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: cleanName,
                category,
                image:
                  imagePreview !== null
                    ? imagePreview
                    : item.image || null,
              }
            : item
        )
      );

      setMessage(
        "Clothing item updated successfully."
      );
    }

    // ADD NEW ITEM
    else {
      const newItem = {
        id: Date.now(),
        name: cleanName,
        category,
        image: imagePreview,
        favorite: false,
      };

      setClothes((current) => [
        ...current,
        newItem,
      ]);

      setMessage(
        "Item added to your closet."
      );
    }

    resetForm();
  };// =====================================================
  // TOGGLE FAVORITE
  // =====================================================

  const handleToggleFavorite = (id) => {
    setClothes((current) => {
      const updatedClothes = current.map((item) =>
        item.id === id
          ? {
              ...item,
              favorite: !item.favorite,
            }
          : item
      );

      const selectedItem = current.find(
        (item) => item.id === id
      );

      if (selectedItem) {
        setMessage(
          selectedItem.favorite
            ? "Removed from favorites."
            : "Added to favorites."
        );
      }

      // Save favorites separately
      const favoriteItems = updatedClothes.filter(
        (item) => item.favorite === true
      );

      localStorage.setItem(
        "smartcloset-favorites",
        JSON.stringify(favoriteItems)
      );

      return updatedClothes;
    });
  };

  // =====================================================
  // DELETE ITEM
  // =====================================================

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const confirmDelete = () => {
    if (deleteId === null) {
      return;
    }

    const deletedItem = clothes.find(
      (item) => item.id === deleteId
    );

    setClothes((current) =>
      current.filter(
        (item) => item.id !== deleteId
      )
    );

    setDeleteId(null);

    setMessage(
      deletedItem
        ? `${deletedItem.name} was removed.`
        : "Item removed."
    );
  };

  // =====================================================
  // CANCEL DELETE
  // =====================================================

  const cancelDelete = () => {
    setDeleteId(null);
  };

  // =====================================================
  // FILTER OPTIONS
  // =====================================================

  const filters = [
    {
      name: "All",
      icon: Shirt,
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
  // FILTER CLOTHES
  // =====================================================

  const filteredClothes = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    return clothes.filter((item) => {
      const itemName = String(
        item.name || ""
      ).toLowerCase();

      const itemCategory = String(
        item.category || ""
      ).toLowerCase();

      const matchesSearch =
        !search ||
        itemName.includes(search) ||
        itemCategory.includes(search);

      const matchesCategory =
        activeFilter === "All" ||
        item.category === activeFilter;

      const matchesFavorite =
        !showFavoritesOnly ||
        item.favorite === true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesFavorite
      );
    });
  }, [
    clothes,
    searchTerm,
    activeFilter,
    showFavoritesOnly,
  ]);

  // =====================================================
  // COUNTS
  // =====================================================

  const totalClothes = clothes.length;

  const favoriteCount = clothes.filter(
    (item) => item.favorite === true
  ).length;

  const categoryCounts = {
    Tops: clothes.filter(
      (item) => item.category === "Tops"
    ).length,

    Bottoms: clothes.filter(
      (item) => item.category === "Bottoms"
    ).length,

    Shoes: clothes.filter(
      (item) => item.category === "Shoes"
    ).length,

    Outerwear: clothes.filter(
      (item) => item.category === "Outerwear"
    ).length,
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {
    setSearchTerm("");
  };

  // =====================================================
  // RESET ALL FILTERS
  // =====================================================

  const resetFilters = () => {
    setSearchTerm("");
    setActiveFilter("All");
    setShowFavoritesOnly(false);
  };

  // =====================================================
  // ITEM SELECTED FOR DELETE
  // =====================================================

  const itemToDelete = clothes.find(
    (item) => item.id === deleteId
  );

  // =====================================================
  // START PAGE
  // =====================================================

  return (
    <section className="my-closet">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="closet-header">

        <div className="closet-header-content">

          <span className="closet-label">
            MY DIGITAL WARDROBE
          </span>

          <h1>
            My <strong>Closet</strong>
          </h1>

          <p>
            Organize your clothes, save your favorites,
            and create beautiful outfits from your wardrobe.
          </p>

        </div>

        <button
          type="button"
          className="add-item-btn"
          onClick={openAddForm}
        >
          <Plus size={19} />
          Add Item
        </button>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="closet-summary">

        <div className="summary-card">

          <div className="summary-icon">
            <Shirt size={21} />
          </div>

          <div>
            <strong>
              {totalClothes}
            </strong>

            <span>
              Total Items
            </span>
          </div>

        </div>


        <div className="summary-card">

          <div className="summary-icon">
            <Heart
              size={21}
              fill="currentColor"
            />
          </div>

          <div>
            <strong>
              {favoriteCount}
            </strong>

            <span>
              Favorites
            </span>
          </div>

        </div>


        <div className="summary-card">

          <div className="summary-icon">
            <Shirt size={21} />
          </div>

          <div>
            <strong>
              {categoryCounts.Tops}
            </strong>

            <span>
              Tops
            </span>
          </div>

        </div>


        <div className="summary-card">

          <div className="summary-icon">
            <Footprints size={21} />
          </div>

          <div>
            <strong>
              {categoryCounts.Shoes}
            </strong>

            <span>
              Shoes
            </span>
          </div>

        </div>

      </div>


      {/* =================================================
          ADD / EDIT FORM
      ================================================= */}

      {showForm && (

        <div className="add-item-panel">

          <div className="add-item-header">

            <div>

              <span>
                {editingId !== null
                  ? "EDIT CLOTHING ITEM"
                  : "NEW CLOTHING ITEM"}
              </span>

              <h2>
                {editingId !== null
                  ? "Edit clothing item"
                  : "Add to your closet"}
              </h2>

            </div>


            <button
              type="button"
              className="close-form-btn"
              onClick={resetForm}
              aria-label="Close form"
            >
              <X size={20} />
            </button>

          </div>


          <form
            className="closet-form"
            onSubmit={handleAddItem}
          >

            {/* NAME */}

            <div className="form-group">

              <label htmlFor="clothing-name">
                Clothing name
              </label>

              <input
                id="clothing-name"
                type="text"
                value={name}
                maxLength={60}
                autoComplete="off"
                placeholder="Example: Black T-shirt"
                onChange={(event) =>
                  setName(event.target.value)
                }
              />

            </div>


            {/* CATEGORY */}

            <div className="form-group">

              <label htmlFor="clothing-category">
                Category
              </label>

              <select
                id="clothing-category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >

                <option value="Tops">
                  Tops
                </option>

                <option value="Bottoms">
                  Bottoms
                </option>

                <option value="Shoes">
                  Shoes
                </option>

                <option value="Outerwear">
                  Outerwear
                </option>

              </select>

            </div>


            {/* IMAGE */}

            <div className="form-group image-upload-group">

              <label>
                Clothing image
              </label>

              <label
                className={`image-upload-box ${
                  imagePreview
                    ? "has-image"
                    : ""
                }`}
              >

                {imagePreview ? (

                  <div className="image-preview-wrapper">

                    <img
                      src={imagePreview}
                      alt="Clothing preview"
                    />

                    <div className="image-preview-overlay">

                      <ImagePlus size={22} />

                      <span>
                        Change image
                      </span>

                    </div>

                  </div>

                ) : (

                  <div className="upload-placeholder">

                    <ImagePlus size={32} />

                    <span>
                      Choose an image
                    </span>

                    <small>
                      JPG, PNG or WEBP · Max 5MB
                    </small>

                  </div>

                )}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleImageChange}
                />

              </label>

            </div>


            {/* FORM ACTIONS */}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-form-btn"
                onClick={resetForm}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="save-item-btn"
              >

                {editingId !== null ? (
                  <>
                    <Pencil size={17} />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Add to Closet
                  </>
                )}

              </button>

            </div>

          </form>

        </div>
      )}{/* =================================================
          SEARCH + FILTER TOOLBAR
      ================================================= */}

      <div className="closet-toolbar">

        {/* SEARCH */}

        <div className="closet-search">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search your wardrobe..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

        </div>


        {/* FILTER */}

        <div className="closet-filter-wrapper">

          <div className="filter-title">

            <Filter size={16} />

            <span>
              Filter
            </span>

          </div>


          <div className="closet-filters">

            {filters.map((filter) => {

              const Icon = filter.icon;

              return (
                <button
                  key={filter.name}
                  type="button"
                  className={`filter-btn ${
                    activeFilter === filter.name
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setActiveFilter(filter.name);
                    setShowFavoritesOnly(false);
                  }}
                >
                  <Icon size={15} />

                  {filter.name}
                </button>
              );
            })}

          </div>

        </div>


        {/* FAVORITES FILTER */}

        <button
          type="button"
          className={`favorites-filter-btn ${
            showFavoritesOnly
              ? "active"
              : ""
          }`}
          onClick={() => {
            setShowFavoritesOnly(
              (current) => !current
            );

            setActiveFilter("All");
          }}
        >

          <Heart
            size={16}
            fill={
              showFavoritesOnly
                ? "currentColor"
                : "none"
            }
          />

          Favorites

        </button>


        {/* RESET */}

        {(searchTerm ||
          activeFilter !== "All" ||
          showFavoritesOnly) && (

          <button
            type="button"
            className="reset-filters-btn"
            onClick={resetFilters}
          >

            <X size={15} />

            Reset

          </button>

        )}

      </div>


      {/* =================================================
          CATEGORY CARDS
      ================================================= */}

      <div className="closet-categories">

        <div className="category-card">

          <div className="category-icon">
            <Shirt size={21} />
          </div>

          <div>

            <strong>
              {categoryCounts.Tops}
            </strong>

            <span>
              Tops
            </span>

          </div>

        </div>


        <div className="category-card">

          <div className="category-icon">
            <Layers size={21} />
          </div>

          <div>

            <strong>
              {categoryCounts.Bottoms}
            </strong>

            <span>
              Bottoms
            </span>

          </div>

        </div>


        <div className="category-card">

          <div className="category-icon">
            <Footprints size={21} />
          </div>

          <div>

            <strong>
              {categoryCounts.Shoes}
            </strong>

            <span>
              Shoes
            </span>

          </div>

        </div>


        <div className="category-card">

          <div className="category-icon">
            <ShoppingBag size={21} />
          </div>

          <div>

            <strong>
              {categoryCounts.Outerwear}
            </strong>

            <span>
              Outerwear
            </span>

          </div>

        </div>

      </div>


      {/* =================================================
          CLOSET GRID
      ================================================= */}

      <div className="closet-grid">

        {filteredClothes.map((item) => (

          <article
            className="closet-item"
            key={item.id}
          >

            {/* IMAGE */}

            <div className="closet-item-image">

              {item.image ? (

                <img
                  src={item.image}
                  alt={item.name}
                />

              ) : (

                <div className="new-item-placeholder">

                  <Shirt size={45} />

                </div>

              )}


              {/* ITEM ACTIONS */}

              <div className="item-actions">

                {/* FAVORITE */}

                <button
                  type="button"
                  className={`favorite-item-btn ${
                    item.favorite
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleToggleFavorite(
                      item.id
                    )
                  }
                  aria-label={
                    item.favorite
                      ? `Remove ${item.name} from favorites`
                      : `Add ${item.name} to favorites`
                  }
                  title={
                    item.favorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >

                  <Heart
                    size={16}
                    strokeWidth={2}
                    fill={
                      item.favorite
                        ? "currentColor"
                        : "none"
                    }
                  />

                </button>


                {/* EDIT */}

                <button
                  type="button"
                  className="edit-item-btn"
                  onClick={() =>
                    handleEditItem(item)
                  }
                  aria-label={`Edit ${item.name}`}
                  title="Edit item"
                >

                  <Pencil
                    size={16}
                    strokeWidth={2}
                  />

                </button>


                {/* DELETE */}

                <button
                  type="button"
                  className="delete-item-btn"
                  onClick={() =>
                    handleDelete(item.id)
                  }
                  aria-label={`Delete ${item.name}`}
                  title="Delete item"
                >

                  <Trash2
                    size={16}
                    strokeWidth={2}
                  />

                </button>

              </div>

            </div>


            {/* ITEM INFORMATION */}

            <div className="closet-item-info">

              <div className="closet-item-title">

                <h3>
                  {item.name}
                </h3>

                <span>
                  {item.category}
                </span>

              </div>


              {/* FAVORITE STATUS */}

              {item.favorite && (

                <div className="favorite-status">

                  <Heart
                    size={13}
                    fill="currentColor"
                  />

                  <span>
                    Favorite
                  </span>

                </div>

              )}

            </div>

          </article>

        ))}

      </div>


      {/* =================================================
          NO SEARCH RESULTS
      ================================================= */}

      {filteredClothes.length === 0 &&
        clothes.length > 0 && (

          <div className="no-results">

            <div className="no-results-icon">

              <Search size={30} />

            </div>

            <h2>
              No clothing found
            </h2>

            <p>
              We couldn't find anything matching
              your current search or filter.
            </p>

            <button
              type="button"
              className="reset-filters-btn"
              onClick={resetFilters}
            >

              <X size={16} />

              Clear Filters

            </button>

          </div>

        )}


      {/* =================================================
          EMPTY CLOSET
      ================================================= */}

      {clothes.length === 0 && (

        <div className="empty-closet">

          <div className="empty-closet-icon">

            <Shirt size={40} />

          </div>

          <h2>
            Your closet is empty
          </h2>

          <p>
            Start building your digital wardrobe
            by adding your first clothing item.
          </p>

          <button
            type="button"
            className="add-item-btn"
            onClick={openAddForm}
          >

            <Plus size={18} />

            Add First Item

          </button>

        </div>

      )}


      {/* =================================================
          TOAST MESSAGE
      ================================================= */}

      {message && (

        <div className="closet-message">

          <div className="message-icon">

            <Check size={17} />

          </div>

          <span>
            {message}
          </span>

        </div>

      )}


      {/* =================================================
          DELETE CONFIRMATION MODAL
      ================================================= */}

      {deleteId !== null && (

        <div
          className="delete-overlay"
          onClick={cancelDelete}
        >

          <div
            className="delete-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL ICON */}

            <div className="delete-modal-icon">

              <AlertTriangle size={28} />

            </div>


            {/* TITLE */}

            <h3>
              Delete clothing item?
            </h3>


            {/* DESCRIPTION */}

            <p>

              Are you sure you want to remove{" "}

              <strong>
                {itemToDelete?.name || "this item"}
              </strong>

              {" "}from your closet?

              This action cannot be undone.

            </p>


            {/* BUTTONS */}

            <div className="delete-modal-actions">

              <button
                type="button"
                className="delete-cancel-btn"
                onClick={cancelDelete}
              >
                Cancel
              </button>


              <button
                type="button"
                className="delete-confirm-btn"
                onClick={confirmDelete}
              >

                <Trash2 size={16} />

                Delete Item

              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}

export default MyCloset;