import { useState, useEffect } from "react";
import "./leftside.css";

export default function Leftside() {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [ingredientsList, setIngredientsList] = useState(() => {
    try {
      const savedList = localStorage.getItem("mealIngredients");
      return savedList === null ? [] : JSON.parse(savedList);
    } catch (error) {
      console.error("Error parsing data from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      const jsonString = JSON.stringify(ingredientsList);
      localStorage.setItem("mealIngredients", jsonString);
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [ingredientsList]);

  const CALORIENINJAS_API_KEY = import.meta.env.VITE_APP_KEY;

  useEffect(() => {
    const fetchNutritionData = async () => {
      console.log("Leftside fetchNutritionData started.");
      console.log(
        "Leftside fetchNutritionData - searchInput for fetch:",
        searchInput
      );
      console.log(
        "Leftside fetchNutritionData - API Key for fetch:",
        CALORIENINJAS_API_KEY
      );

      if (!searchInput || !CALORIENINJAS_API_KEY) {
        console.log(
          "Leftside Fetch skipped: searchInput or API Key missing for fetch."
        );
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
          const errorText = await response.text();
          console.error("Leftside API Error Response Text:", errorText);
          throw new Error(
            `HTTP error! Status: ${response.status} - ${
              response.statusText || "Unknown error"
            }`
          );
        }

        const data = await response.json();
        console.log("Leftside API Response Data:", data);
        setSearchResults(data.items || []);
      } catch (err) {
        console.error("Leftside Fetching Error:", err);
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

  const initialIngredientValue = {
    calories: 0,
    protein_g: 0,
    carbohydrates_total_g: 0,
    fat_total_g: 0,
    fiber_g: 0,
    sugar_g: 0,
    sodium_mg: 0,
    cholesterol_mg: 0,
  };

  const ingredientSum = ingredientsList.reduce(
    (accumulator, currentFoodItem) => {
      accumulator.calories += currentFoodItem.calories || 0;
      accumulator.protein_g += currentFoodItem.protein_g || 0;
      accumulator.carbohydrates_total_g +=
        currentFoodItem.carbohydrates_total_g || 0;
      accumulator.fat_total_g += currentFoodItem.fat_total_g || 0;
      accumulator.sugar_g += currentFoodItem.sugar_g || 0;
      accumulator.fiber_g += currentFoodItem.fiber_g || 0;
      accumulator.sodium_mg += currentFoodItem.sodium_mg || 0;
      accumulator.cholesterol_mg += currentFoodItem.cholesterol_mg || 0;
      return accumulator;
    },
    initialIngredientValue
  );

  const handleDelBtn = (nameToDelete, servingSizeToDelete) => {
    setIngredientsList((prevList) => {
      return prevList.filter(
        (ingredient) =>
          !(
            ingredient.name === nameToDelete &&
            ingredient.serving_size_g === servingSizeToDelete
          )
      );
    });
  };

  const handleAddItem = (foodAdd) => {
    const itemToAdd = {
      ...foodAdd,
      id:
        foodAdd.id || `${foodAdd.name}-${foodAdd.serving_size_g}-${Date.now()}`,
      calories: foodAdd.calories || 0,
      protein_g: foodAdd.protein_g || 0,
      carbohydrates_total_g: foodAdd.carbohydrates_total_g || 0,
      fat_total_g: foodAdd.fat_total_g || 0,
      fiber_g: foodAdd.fiber_g || 0,
      sugar_g: foodAdd.sugar_g || 0,
    };
    setIngredientsList((prevList) => [...prevList, itemToAdd]);
  };

  return (
    <>
      <div className="mp-container">
        <div className="ingredients-container">
          <h2>Meal Planner</h2>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="search"
            placeholder="Search for food to add..."
          />
          <ul>
            {isLoading && searchInput && <p>Searching...</p>}
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
                  style={{ cursor: "pointer" }}
                  className="searchBar"
                  onClick={() => handleAddItem(food)}
                  key={food.name + food.serving_size_g + index}
                >
                  {food.name} ({food.calories || 0} kcal)
                </p>
              ))}
            {!searchInput && <p>Start typing to search for food items.</p>}
          </ul>
          <span>
            {ingredientsList.map((foodItem, index) => (
              <p
                key={
                  foodItem.id || foodItem.name + foodItem.serving_size_g + index
                }
              >
                {foodItem.name}{" "}
                <span
                  onClick={() =>
                    handleDelBtn(foodItem.name, foodItem.serving_size_g)
                  }
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
          <div className="nutrient-details-grid">
            <p>
              <span>Calories:</span>{" "}
              <strong>{ingredientSum.calories.toFixed(1) || 0}</strong> kcal
            </p>
            <p>
              <span>Protein:</span>{" "}
              <strong>{ingredientSum.protein_g.toFixed(1) || 0}</strong> g
            </p>
            <p>
              <span>Carbs:</span>{" "}
              <strong>
                {ingredientSum.carbohydrates_total_g.toFixed(1) || 0}
              </strong>{" "}
              g
            </p>
            <p>
              <span>Fat:</span>{" "}
              <strong>{ingredientSum.fat_total_g.toFixed(1) || 0}</strong> g
            </p>
            <p>
              <span>Fiber:</span>{" "}
              <strong>{ingredientSum.fiber_g.toFixed(1) || 0}</strong> g
            </p>
            <p>
              <span>Sugar:</span>{" "}
              <strong>{ingredientSum.sugar_g.toFixed(1) || 0}</strong> g
            </p>
            <p>
              <span>Sodium:</span>{" "}
              <strong>{ingredientSum.sodium_mg.toFixed(1) || 0}</strong> mg
            </p>
            <p>
              <span>Cholesterol:</span>{" "}
              <strong>{ingredientSum.cholesterol_mg.toFixed(1) || 0}</strong> mg
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
