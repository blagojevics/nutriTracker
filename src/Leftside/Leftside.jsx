import { useState, useEffect } from "react";
import { foods } from "../Test/foods";
import "./leftside.css";

export default function Leftside() {
  const [searchInput, setSearchInput] = useState("");
  const [ingredientsList, setIngredientsList] = useState(() => {
    try {
      const savedList = localStorage.getItem("mealIngredients");
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
    const jsonString = JSON.stringify(ingredientsList);
    // Save it to localStorage
    localStorage.setItem("mealIngredients", jsonString);
    console.log("Saved ingredient to localStorage:", ingredientsList); // For debugging
  }, [ingredientsList]); // Dependency array: run this effect whenever ingredientsList changes

  const initialIngredientValue = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  };
  const ingredientSum = ingredientsList.reduce(
    (accumulator, currentFoodItem) => {
      accumulator.calories += currentFoodItem.calories || 0;
      accumulator.protein += currentFoodItem.protein || 0;
      accumulator.carbs += currentFoodItem.carbs || 0;
      accumulator.fat += currentFoodItem.fat || 0;
      accumulator.sugar += currentFoodItem.sugar || 0;
      accumulator.fiber += currentFoodItem.fiber || 0;

      return accumulator;
    },
    initialIngredientValue
  );

  const handleDelBtn = (idToDelete) => {
    setIngredientsList((prevList) => {
      return prevList.filter((ingredient) => ingredient.id !== idToDelete);
    });
  };

  const handleAddItem = (foodAdd) => {
    setIngredientsList((prevFoodAdd) => {
      return [...prevFoodAdd, foodAdd];
    });
  };

  const filteredIngredients = foods.filter((food) =>
    food.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <div className="mp-container">
        <div className="ingredients-container">
          <h2>Meal Planner</h2>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="search"
            placeholder="Add your ingredient"
          />
          {/* <button onClick={(foodAdd) => handleAddItem(foodAdd)}>Add</button>*/}
          <br />
          <ul>
            {searchInput === "" ? (
              <p></p>
            ) : filteredIngredients.length === 0 ? (
              <p>No result fount for {searchInput}</p>
            ) : (
              filteredIngredients.map((food) => (
                <p onClick={() => handleAddItem(food)} key={food.id}>
                  {food.name}
                </p>
              ))
            )}
          </ul>
          <span>
            {ingredientsList.map((foodList) => (
              <p key={Math.random() * 200}>
                {foodList.name}{" "}
                <span
                  onClick={() => handleDelBtn(foodList.id)}
                  style={{ color: "red", marginLeft: "20px" }}
                >
                  X
                </span>
              </p>
            ))}
          </span>
        </div>
        <div className="total-container">
          <h3>Total:</h3>

          <span>Calories: {ingredientSum.calories.toFixed(1)}g</span>
          <span>Protein: {ingredientSum.protein.toFixed(1)} g</span>
          <span>Carbs: {ingredientSum.carbs.toFixed(1)} g</span>
          <span>Fat: {ingredientSum.fat.toFixed(1)} g</span>
          <span>Fiber: {ingredientSum.fiber.toFixed(1)} g</span>
          <span>Sugar: {ingredientSum.sugar.toFixed(1)} g</span>
        </div>
      </div>
    </>
  );
}
