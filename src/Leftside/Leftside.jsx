import { useState } from "react";
import { foods } from "../Test/foods";
import "./leftside.css";

export default function Leftside() {
  const [searchInput, setSearchInput] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [totalNutr, setTotalNutr] = useState("");

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
      <h2>Meal Planner</h2>
      <div className="mp-container">
        <div className="ingredients-container">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="search"
            placeholder="Add your ingredient"
          />
          <button onClick={(foodAdd) => handleAddItem(foodAdd)}>Add</button>
          <br />
          <ul>
            {searchInput === "" ? (
              <p>Start typing...</p>
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
              <li key={foodList.id && foodList.name}>{foodList.name}</li>
            ))}
          </span>
        </div>
        <div className="total-container">
          <h3>Total:</h3>fdsfsdf

          <span>Calories: {ingredientsList.calories}g</span>
          <span>Protein: {ingredientsList.protein} g</span>
          <span>Carbs: {ingredientsList.carbs} g</span>
          <span>Fat: {ingredientsList.fat} g</span>
          <span>Fiber: {ingredientsList.fiber} g</span>
          <span>Sugar: {ingredientsList.sugar} g</span>
        </div>
      </div>
    </>
  );
}


export default function Rightside() {
  const [showNutrValue, setShowNutrValue] = useState({});
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
