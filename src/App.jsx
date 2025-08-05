import Rightside from "./Rightside/Rightside";
import Leftside from "./Leftside/Leftside";

import "./App.css";
export default function App() {
  return (
    <div className="nutritracker">
      <Leftside />
      <Rightside />
    </div>
  );
}
