import { useEffect, useState } from "react";
import { ADD_TODO, GET_TODOS } from "./constants/ApiUrls";
import axios from "axios";
import type { Todo } from "./constants/Types";

const EMPTY_FIELD_ERROR = "Field cant be empty !!";
const SERVER_ERROR = "There is a problem, try again later.";

function Modal({ setTodos }: { setTodos?: () => void }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  async function handleAdd() {
    if (!text) {
      setError(EMPTY_FIELD_ERROR);
      return;
    }
    try {
      console.log(text);
      const { data } = await axios.post(ADD_TODO, { text });
      alert("Todo added !!");
    } catch (e) {
      setError(SERVER_ERROR);
    }
    setError("");
  }

  return (
    <div>
      <h3>What's your todo ?</h3>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {error}
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function getTodos() {
      const { data } = await axios.get(GET_TODOS);
      setTodos(data);
    }
    getTodos();
  }, []);

  return (
    <div>
      <h1>Hellooo broskitoooo todos</h1>
      <div>-------------------------</div>
      {todos?.map((e, index) => {
        return <div key={e.id}>{e.text}</div>;
      })}
      <div>-------------------------</div>
      <Modal />
    </div>
  );
}

export default App;
