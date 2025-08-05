import { useState, useEffect } from "react";
import "./rightside.css";
import { foods } from "../Test/foods";

export default function Rightside() {
  const [showNutrValue, setShowNutrValue] = useState(() => {
    try {
      // The saved item here might be a single object, not an array.
      // So localStorage.getItem("mealIngredient") should perhaps be "selectedNutrient"
      // to not conflict with Leftside's "mealIngredients" (which is a list).
      const savedItem = localStorage.getItem("selectedNutrientDetail"); // Use a distinct key
      if (savedItem === null) {
        return null; // Initialize with null if nothing saved
      }
      return JSON.parse(savedItem); // Parse the string back into a JS object
    } catch (error) {
      console.error("Error parsing data from localStorage:", error);
      return null; // Return null on parse error
    }
  });

  useEffect(() => {
    try {
      // Save showNutrValue (the single selected food object) to localStorage
      // Ensure you're not saving "null" directly, as that might cause issues for JSON.parse on next load.
      if (showNutrValue !== null) {
        localStorage.setItem(
          "selectedNutrientDetail",
          JSON.stringify(showNutrValue)
        );
        console.log("Selected nutrient saved to localStorage:", showNutrValue);
      } else {
        localStorage.removeItem("selectedNutrientDetail"); // Remove if selection is cleared
        console.log("Selected nutrient cleared from localStorage.");
      }
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [showNutrValue]); // Dependency: run this effect whenever showNutrValue changes

  const [searchInput, setSearchInput] = useState("");

  // Handler for the clear button
  const handleClearDetails = () => {
    setShowNutrValue(null); // Set the state back to null to hide the details
    setSearchInput(""); // Optionally clear the search input too
  };

  // Handler for search input change (only updates search term)
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    // Optionally clear details if user starts typing a new search
    // If you want details to persist until something new is clicked, remove this line
    // setShowNutrValue(null);
  };

  // Handler for clicking a food item in the search results
  const handleFoodDetails = (foodClicked) => {
    setShowNutrValue(foodClicked); // Set the full food object for display
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
          onChange={handleSearchInputChange} // Use the more specific handler name
          value={searchInput}
          type="search"
          placeholder="Search..."
        />
        <ul>
          {searchInput === "" ? (
            <p>Start typing...</p>
          ) : filteredItems.length === 0 ? (
            <p>No result found for "{searchInput}"</p> // Fixed typo: "fount" -> "found"
          ) : (
            filteredItems.map((food) => (
              <p onClick={() => handleFoodDetails(food)} key={food.id}>
                {food.name}
              </p>
            ))
          )}
        </ul>
        <div className="nutrients-container">
          {showNutrValue ? ( // Conditionally render if showNutrValue is not null
            <>
              <h3
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                Nutrients for: {showNutrValue.name}{" "}
                <span
                  onClick={handleClearDetails} // <-- Call the new handler here
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
              {/* Display nutrients (adjust for nested 'nutrients' object if applicable) */}
              <span>
                Calories:{" "}
                {showNutrValue.calories ||
                  showNutrValue.nutrients.calories ||
                  0}{" "}
                g
              </span>
              <span>
                Protein:{" "}
                {showNutrValue.protein || showNutrValue.nutrients.protein || 0}{" "}
                g
              </span>
              <span>
                Carbs:{" "}
                {showNutrValue.carbs || showNutrValue.nutrients.carbs || 0} g
              </span>
              <span>
                Fat: {showNutrValue.fat || showNutrValue.nutrients.fat || 0} g
              </span>
              <span>
                Fiber:{" "}
                {showNutrValue.fiber || showNutrValue.nutrients.fiber || 0} g
              </span>
              <span>
                Sugar:{" "}
                {showNutrValue.sugar || showNutrValue.nutrients.sugar || 0} g
              </span>
            </>
          ) : (
            <p>Click an ingredient to view its details.</p>
          )}
        </div>
      </div>
    </>
  );
}
