import { useState, useEffect } from "react";
import "./rightside.css";
import { foods } from "../Test/foods";

export default function Rightside() {
  const [showNutrValue, setShowNutrValue] = useState(() => {
    try {
      const savedList = localStorage.getItem("mealIngredient");
      if (savedList === null) {
        // More explicit check for null if no item exists
        return []; // No saved data found, so initialize with an empty array
      }
      // If data is found, parse it
      return JSON.parse(savedList);
    } catch (error) {
      console.error("Error parsing data from localStorage:", error);
      // If there's an error parsing (e.g., corrupted data), initialize with an empty array
      return [];
    }
  });

  useEffect(() => {
    // This code runs whenever 'ingredientsList' changes
    // Convert the JS array/object to a JSON string
    const jsonString = JSON.stringify(showNutrValue);
    // Save it to localStorage
    localStorage.setItem("mealIngredient", jsonString);
    console.log("Saved ingredients to localStorage:", showNutrValue); // For debugging
  }, [showNutrValue]); // Dependency array: run this effect whenever ingredientsList changes
  const [searchInput, setSearchInput] = useState("");

  const handleFoodDetails = (foodClicked) => {
    setShowNutrValue(foodClicked);
  };

  const filteredItems = foods.filter((food) =>
    food.name.toLowerCase().includes(searchInput.toLowerCase())
  );
  return (
    <>
      <div className="container">
        <h2>NutriTracker</h2>
        <input
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          type="search"
          placeholder="Search..."
        />
        <ul>
          {searchInput === "" ? (
            <p>Start typing...</p>
          ) : filteredItems.length === 0 ? (
            <p>No result fount for {searchInput}</p>
          ) : (
            filteredItems.map((food) => (
              <p onClick={() => handleFoodDetails(food)} key={food.id}>
                {food.name}
              </p>
            ))
          )}
        </ul>
        <div className="nutrients-container">
          <h3>Nutrients for: {showNutrValue.name} </h3>
          <span>Calories: {showNutrValue.calories} g</span>
          <span>Protein: {showNutrValue.protein} g</span>
          <span>Carbs: {showNutrValue.carbs} g</span>
          <span>Fat: {showNutrValue.fat} g</span>
          <span>Fiber: {showNutrValue.fiber} g</span>
          <span>Sugar: {showNutrValue.sugar} g</span>
        </div>
      </div>
    </>
  );
}
