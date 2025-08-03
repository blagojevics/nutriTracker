const sItems = [
  { id: 1, name: "Apple", color: "Red", taste: "Sweet" },
  { id: 2, name: "Banana", color: "Yellow", taste: "Creamy" },
  { id: 3, name: "Orange", color: "Orange", taste: "Citrus" },
];
export default sItems;

const [backgroundColor, setBackgroundColor] = useState("white");
const handleColorChange = (getColor) => {
  setBackgroundColor(getColor);
};
return (
  <>
    <h1>Color Picker</h1>
    <div
      style={{
        width: "200px",
        height: "200px",
        border: "solid 1px white",
        backgroundColor: backgroundColor,
        color: "black",
      }}
    >
      Current color:{backgroundColor}
    </div>
    <button onClick={() => handleColorChange("red")}>Red</button>
    <button onClick={() => handleColorChange("purple")}>Purple</button>
    <button onClick={() => handleColorChange("white")}>White</button>
    <button onClick={() => handleColorChange("")}>Reset</button>
  </>
);
