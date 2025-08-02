/* 
export default function App() {
  const [todoInput, setTodoInput] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [completed, setCompleted] = useState(false);
  const handleDelBtn = (idTodelete) => {
    setTodoList((prevTodoList) => {
      return prevTodoList.filter((todo) => todo.id !== idTodelete);
    });
  };
  const handleTodoBtn = () => {
    const todoObject = {
      id: Date.now(),
      text: todoInput,
      complete: false,
    };
    setTodoList(() => [...todoList, todoObject]);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <input
          type="text"
          placeholder="Add Todo"
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
        />
        <button onClick={handleTodoBtn}>+</button>
      </div>
      <div
        style={{
          width: "100%",
          height: "300px",
          border: "solid 1px white",
          marginTop: "20px",
        }}
        className="todo-container"
      >
        <div
          style={{
            width: "100%",
            height: "70px",
            border: "solid 1px white",
          }}
          className="todo-items"
        >
          {todoList.map((todo) => (
            <div
              key={todo.id}
              style={{
                width: "100%",
                height: "70px",

                marginBottom: "5px",
                display: "flex",
                alignItems: "center",

                gap: "50px",
              }}
              className="todo-item-display"
            >
              {todo.text}{" "}
              <button onClick={() => handleDelBtn(todo.id)}>del</button>
              <input
                type="checkbox"
                value={completed}
                onChange={(e) => setCompleted(e.target.checked)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
*/
