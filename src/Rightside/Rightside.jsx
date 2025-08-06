import { useState, useEffect } from "react";
import "./rightside.css";
import { foods } from "../Test/foods";

export default function Rightside() {
  const [searchInput, setSearchInput] = useState("");

  const [showNutrValue, setShowNutrValue] = useState(() => {
    try {
      const savedItem = localStorage.getItem("selectedNutrientDetail");
      if (
        savedItem === null ||
        savedItem === undefined ||
        savedItem === "null"
      ) {
        // <-- More explicit check for null string
        return null; // Initialize with null if nothing valid saved
      }
      const parsedItem = JSON.parse(savedItem);
      // Double-check: ensure parsed item is actually an object with expected properties
      if (
        typeof parsedItem === "object" &&
        parsedItem !== null &&
        parsedItem.id &&
        parsedItem.name
      ) {
        return parsedItem;
      } else {
        console.warn(
          "Parsed item from localStorage is not a valid food object, returning null."
        );
        return null; // Return null if parsed data is not an object or is malformed
      }
    } catch (error) {
      console.error("Error parsing data from localStorage:", error);
      return null; // Return null on any parsing error
    }
  });

  useEffect(() => {
    try {
      if (showNutrValue !== null) {
        localStorage.setItem(
          "selectedNutrientDetail",
          JSON.stringify(showNutrValue)
        );
        console.log("Saved nutrient to localStorage:", showNutrValue);
      } else {
        localStorage.removeItem("selectedNutrientDetail"); // Remove if selection is cleared
        console.log("Selected nutrient cleared from localStorage.");
      }
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [showNutrValue]);

  // Handler for clearing selected food details
  const handleClearDetails = () => {
    setShowNutrValue(null);
    setSearchInput("");
  };

  // Handler for search input change
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    // OPTIONAL: Clear details if user starts typing a new search (uncomment if desired)
    // if (event.target.value !== "") {
    //   setShowNutrValue(null);
    // }
  };

  // Handler for clicking a food item in search results
  const handleFoodDetails = (foodClicked) => {
    setShowNutrValue(foodClicked);
    // Optional: Clear the search input after selecting an item
    // setSearchInput("");
  };

  const filteredItems = foods.filter((food) =>
    food.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <div className="container">
        <h2>NutriTracker</h2>
        <input
          onChange={handleSearchInputChange}
          value={searchInput}
          type="search"
          placeholder="Search..."
        />
        <ul>
          {searchInput === "" ? (
            <p>Start typing...</p>
          ) : filteredItems.length === 0 ? (
            <p>No result found for "{searchInput}"</p>
          ) : (
            filteredItems.map((food) => (
              <p
                className="searchBar"
                onClick={() => handleFoodDetails(food)}
                key={food.id}
              >
                {food.name}
              </p>
            ))
          )}
        </ul>
        <div className="nutrients-container">
          {showNutrValue ? ( // This checks if showNutrValue is truthy (an object, not null/0/false/undefined)
            <>
              <h3
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                Nutrients for: {showNutrValue.name} <br />
                per 100g
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
              <span>
                Calories:{" "}
                {showNutrValue.calories ||
                  showNutrValue.nutrients?.calories ||
                  0}{" "}
                g
              </span>
              <span>
                Protein:{" "}
                {showNutrValue.protein || showNutrValue.nutrients?.protein || 0}{" "}
                g
              </span>
              <span>
                Carbs:{" "}
                {showNutrValue.carbs || showNutrValue.nutrients?.carbs || 0} g
              </span>
              <span>
                Fat: {showNutrValue.fat || showNutrValue.nutrients?.fat || 0} g
              </span>
              <span>
                Fiber:{" "}
                {showNutrValue.fiber || showNutrValue.nutrients?.fiber || 0} g
              </span>
              <span>
                Sugar:{" "}
                {showNutrValue.sugar || showNutrValue.nutrients?.sugar || 0} g
              </span>
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
