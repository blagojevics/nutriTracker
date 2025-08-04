import { useState } from "react";
import { foods } from "../Test/foods";
import "./leftside.css";

export default function Leftside() {
  const [searchInput, setSearchInput] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [totalNutr, setTotalNutr] = useState("");

  const handleAddItem = (foodAdd) => {
    setIngredientsList(foodAdd);
    console.log(foodAdd);
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
          <button onClick={handleAddItem}>Add</button>
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
            {ingredientsList.name} - {ingredientsList.unit}
          </span>
        </div>
        <div className="total-container">
          <h3>Total:</h3>

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
