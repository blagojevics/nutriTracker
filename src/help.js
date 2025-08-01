export default function App() {
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState(null); // This will hold ONE food object OR null

  // This is the function that gets called when a food item in the list is clicked
  const handleFoodItemClick = (foodThatWasClicked) => {
    // 1. Log to verify which specific food object was passed (for debugging)
    console.log("You clicked on:", foodThatWasClicked.name);

    // 2. THIS IS THE KEY: Set the 'selectedFood' state to the ENTIRE food object that was clicked.
    //    It is NOT setting it to an <li> or a list of <li>s. It's the DATA.
    setSelectedFood(foodThatWasClicked);
  };

  // This is for your + button (if it's meant for something else later, e.g., adding to a meal list)
  // For now, let's keep it simple or remove it until you need it for the meal builder
  const handleAddButton = () => {
    // If you plan to add the currently selectedFood to a meal, this is where that logic would go.
    // For now, it doesn't do anything relevant to the 'selecting a single food for details' part.
    console.log("Add button clicked.");
    // Maybe later: setMealIngredients((prev) => [...prev, selectedFood]);
  };

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  // --- JSX START ---
  return (
    <>
      <h1>Search for ingredients </h1>
      <input
        type="text"
        value={search}
        placeholder="Search for ingredients"
        onChange={(e) => setSearch(e.target.value)}
      />{" "}
      {/* You had a button here, which could be for 'add to meal' later. Let's keep it. */}
      <button onClick={handleAddButton}>+</button>
      <h2>You searched for: {search}</h2> {/* This shows what the user typed */}
      {/* This is the container for your search RESULTS LIST */}
      <div
        className="ing-container"
        style={{
          border: "1px solid white",
          marginTop: "50px",
          padding: "10px",
        }}
      >
        {/* Only show the list if there's a search term and results */}
        {search.length > 0 && filteredFoods.length > 0 ? (
          <ul>
            {filteredFoods.map((food) => (
              <li
                key={food.id || food.name} // Always need a key! food.id is best.
                onClick={() => handleFoodItemClick(food)} // Call your click handler, pass THIS food object
                style={{
                  cursor: "pointer",
                  padding: "8px",
                  borderBottom: "1px solid #333",
                }}
              >
                {/* Display basic info for each search result */}
                {food.name}
              </li>
            ))}
          </ul>
        ) : search.length > 0 && filteredFoods.length === 0 ? (
          <p>No results found for "{search}".</p>
        ) : (
          <p>Start typing to search for food ingredients!</p>
        )}
      </div>
      {/* --- CONDITIONAL RENDERING FOR THE SELECTED FOOD DETAILS --- */}
      {/* This section ONLY shows if selectedFood is not null */}
      {selectedFood && (
        <div
          className="selected-food-details"
          style={{
            border: "2px solid green",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <h2>Details for: {selectedFood.name}</h2>
          <p>Calories: {selectedFood.calories}g</p>
          <p>Protein: {selectedFood.protein}g</p>
          <p>Carbs: {selectedFood.carbs}g</p>
          <p>Fat: {selectedFood.fat}g</p>
          <p>Fiber: {selectedFood.fiber}g</p>
          <p>Sugar: {selectedFood.sugar}g</p>
          {/* You could put your "+" button or "Add to Meal" button here to act on this specific selectedFood */}
        </div>
      )}
    </>
  );
}
