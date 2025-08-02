import { useState } from "react";
import "./App.css";
import sItems from "./sItems";

export default function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const handleItemClick = (itemClicked) => {
    setSelectedItem(itemClicked);
  };
  return (
    <>
      <h1>Simple item list</h1>
      <div>
        {sItems.map((item) => (
          <li key={item.id} onClick={() => handleItemClick(item)}>
            {item.name}
          </li>
        ))}
        <div style={{ border: "solid 1px white", marginTop: "50px" }}>
          {selectedItem && (
            <>
              <p>{selectedItem.name}</p>
              <p>{selectedItem.color}</p>
              <p>{selectedItem.taste}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
