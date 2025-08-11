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

  console.log("CALORIENINJAS_API_KEY value:", CALORIENINJAS_API_KEY);
  console.log("searchInput value when component renders:", searchInput);

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

        if (data && data.items && data.items.length > 0) {
          setSearchResults(data.items);
        } else {
          setSearchResults([]);
        }
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
        <h2>NutriTracker</h2>
        <input
          onChange={handleSearchInputChange}
          value={searchInput}
          type="search"
          placeholder="Search for food (e.g., '1 apple', '100g chicken')"
        />
        <ul>
          {isLoading && searchInput && <p>Searching for "{searchInput}"...</p>}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
          {!isLoading &&
            !error &&
            searchInput &&
            searchResults.length === 0 && (
              <p>No results found for "{searchInput}"</p>
            )}
          {!isLoading &&
            !error &&
            searchInput &&
            searchResults.length > 0 &&
            searchResults.map((food, index) => (
              <p
                className="searchBar"
                onClick={() => handleFoodDetails(food)}
                key={food.name + food.serving_size_g + index}
              >
                {food.name} ({food.calories} kcal)
              </p>
            ))}
          {!searchInput && (
            <p>Start typing to search for food on CalorieNinjas API...</p>
          )}
        </ul>
        <div className="nutrients-container">
          {showNutrValue ? (
            <>
              <h3
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                Nutrients for: {showNutrValue.name}
                <span
                  onClick={handleClearDetails}
                  style={{
                    color: "red",
                    marginLeft: "20px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  X
                </span>
              </h3>
              <p
                style={{ marginTop: "-10px", fontSize: "0.9em", color: "#aaa" }}
              >
                Serving Size: {showNutrValue.serving_size_g || 0} g
              </p>

              <div className="nutrient-details-grid">
                <p>
                  <span>Calories:</span>{" "}
                  <strong>{showNutrValue.calories || 0}</strong> kcal
                </p>
                <p>
                  <span>Protein:</span>{" "}
                  <strong>{showNutrValue.protein_g || 0}</strong> g
                </p>
                <p>
                  <span>Carbs:</span>{" "}
                  <strong>{showNutrValue.carbohydrates_total_g || 0}</strong> g
                </p>
                <p>
                  <span>Fat:</span>{" "}
                  <strong>{showNutrValue.fat_total_g || 0}</strong> g
                </p>
                <p>
                  <span>Fiber:</span>{" "}
                  <strong>{showNutrValue.fiber_g || 0}</strong> g
                </p>
                <p>
                  <span>Sugar:</span>{" "}
                  <strong>{showNutrValue.sugar_g || 0}</strong> g
                </p>
                <p>
                  <span>Sodium:</span>{" "}
                  <strong>{showNutrValue.sodium_mg || 0}</strong> mg
                </p>
                <p>
                  <span>Cholesterol:</span>{" "}
                  <strong>{showNutrValue.cholesterol_mg || 0}</strong> mg
                </p>
              </div>
            </>
          ) : (
            <p style={{ textAlign: "center", paddingTop: "50px" }}>
              Click an ingredient to view its details.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
