import { useState, useEffect } from "react";
import "./rightside.css";

export default function Rightside() {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showNutrValue, setShowNutrValue] = useState(() => {
    try {
      const savedItem = localStorage.getItem("selectedNutrientDetail");
      const parsedItem =
        savedItem === null || savedItem === "null"
          ? null
          : JSON.parse(savedItem);

      if (
        typeof parsedItem === "object" &&
        parsedItem !== null &&
        parsedItem.name
      ) {
        return parsedItem;
      }
      return null;
    } catch (error) {
      console.error("Error parsing data from localStorage:", error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (showNutrValue !== null) {
        localStorage.setItem(
          "selectedNutrientDetail",
          JSON.stringify(showNutrValue)
        );
      } else {
        localStorage.removeItem("selectedNutrientDetail");
      }
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [showNutrValue]);

  const CALORIENINJAS_API_KEY = import.meta.env.VITE_APP_KEY;

  useEffect(() => {
    const fetchNutritionData = async () => {
      if (!searchInput || !CALORIENINJAS_API_KEY) {
        setSearchResults([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(
            searchInput
          )}`,
          {
            method: "GET",
            headers: {
              "X-Api-Key": CALORIENINJAS_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status} - ${
              response.statusText || "Unknown error"
            }`
          );
        }

        const data = await response.json();
        setSearchResults(data.items || []);
      } catch (err) {
        setError(err.message || "Failed to fetch nutrition data.");
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchNutritionData();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchInput, CALORIENINJAS_API_KEY]);

  const handleClearDetails = () => {
    setShowNutrValue(null);
    setSearchInput("");
    setSearchResults([]);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleFoodDetails = (foodClicked) => {
    setShowNutrValue(foodClicked);
  };

  return (
    <>
      <div className="container">
        <div className="background-image-overlay"></div>
        <h2 className="main-title">Get nutrients for ingredients!</h2>
        <div className="input-container">
          <input
            onChange={handleSearchInputChange}
            value={searchInput}
            type="search"
            placeholder="(e.g., '1 apple', '200g chicken')"
          />
          <ul className="search-results-list">
            {isLoading && searchInput && (
              <p className="message-text">Searching for "{searchInput}"...</p>
            )}
            {error && <p className="message-text error-text">Error: {error}</p>}
            {!isLoading &&
              !error &&
              searchInput &&
              searchResults.length === 0 && (
                <p className="message-text">
                  No results found for "{searchInput}"
                </p>
              )}
            {!isLoading &&
              !error &&
              searchInput &&
              searchResults.length > 0 &&
              searchResults.map((food, index) => (
                <p
                  style={{ cursor: "pointer" }}
                  className="searchBar"
                  onClick={() => handleFoodDetails(food)}
                  key={food.name + food.serving_size_g + index}
                >
                  {food.name} ({food.calories} kcal)
                </p>
              ))}
            {!searchInput && (
              <p className="message-text hint-text">Search for ingredient...</p>
            )}
          </ul>
        </div>
        <div className="nutrients-container">
          {showNutrValue ? (
            <>
              <h3 className="nutrient-header">
                {showNutrValue.name}
                <span
                  className="clear-details-button"
                  onClick={handleClearDetails}
                >
                  X
                </span>
              </h3>
              <p className="serving-size-text">
                Serving Size: {showNutrValue.serving_size_g || 0}{" "}
                {console.log(showNutrValue.serving_size_g)} g
              </p>

              <div className="nutrient-details-grid">
                <p>
                  <span className="nutrient-label">Calories:</span>{" "}
                  <strong className="nutrient-value">
                    {showNutrValue.calories.toFixed(1) || 0}
                  </strong>{" "}
                  kcal
                </p>
                <p>
                  <span className="nutrient-label">Protein:</span>{" "}
                  <strong className="nutrient-value">
                    {showNutrValue.protein_g.toFixed(1) || 0}
                  </strong>{" "}
                  g
                </p>
                <p>
                  <span className="nutrient-label">Carbs:</span>{" "}
                  <strong className="nutrient-value">
                    {showNutrValue.carbohydrates_total_g.toFixed(1) || 0}
                  </strong>{" "}
                  g
                </p>
                <p>
                  <span className="nutrient-label">Fat:</span>{" "}
                  <strong className="nutrient-value">
                    {showNutrValue.fat_total_g.toFixed(1) || 0}
                  </strong>{" "}
                  g
                </p>
                <p>
                  <span className="nutrient-label">Fiber:</span>{" "}
                  <strong className="nutrient-value">
                    {showNutrValue.fiber_g.toFixed(1) || 0}
                  </strong>{" "}
                  g
                </p>
                <p>
                  <span className="nutrient-label">Sugar:</span>{" "}
                  <strong className="nutrient-value">
                    {showNutrValue.sugar_g.toFixed(1) || 0}
                  </strong>{" "}
                  g
                </p>
                <p>
                  <span className="nutrient-label">Sodium:</span>{" "}
                  <strong className="nutrient-value">
                    {showNutrValue.sodium_mg.toFixed(1) || 0}
                  </strong>{" "}
                  mg
                </p>
                <p>
                  <span className="nutrient-label">Cholesterol:</span>{" "}
                  <strong className="nutrient-value">
                    {showNutrValue.cholesterol_mg.toFixed(1) || 0}
                  </strong>{" "}
                  mg
                </p>
              </div>
            </>
          ) : (
            <p className="message-text hint-text">
              Click an ingredient to view its details.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
