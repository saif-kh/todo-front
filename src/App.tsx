import { useEffect, useState } from "react";
import {
  ADD_TODO,
  CHANGE_TODO,
  DELETE_TODO,
  GET_TODOS,
} from "./constants/ApiUrls";
import axios from "axios";
import type { Todo } from "./constants/Types";

const EMPTY_FIELD_ERROR = "Field cant be empty !!";
const SERVER_ERROR = "There is a problem, try again later.";

function Modal() {
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
    </div>
  );
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function getTodos() {
      try {
        const res = await axios.get(GET_TODOS);
        setTodos(res?.data);
        setIsError(false);
      } catch (e) {
        console.log(e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(true);
    getTodos();
  }, []);

  async function deleteTodo(id: number) {
    try {
      const { data } = await axios.delete(DELETE_TODO + id);
      let temp: Todo[] = todos.filter((e) => e.id !== id);
      setTodos([...temp]);
    } catch (error) {
      console.log(error);
    }
  }

  async function changeStatus(id: number) {
    try {
      const { data } = await axios.get(CHANGE_TODO + id);
      let temp: Todo[] = todos.map((e) => {
        return e.id === id ? { ...e, todoStatus: "DONE" } : e;
      });
      setTodos([...temp]);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>My todos</h1>
      <div>-------------------------</div>
      {isError ? (
        <div>We having an error</div>
      ) : isLoading ? (
        <div>Loading ...</div>
      ) : (
        todos?.length === 0 && <div>No todos so far</div>
      )}
      {todos?.map((e, index) => {
        return (
          <div key={e.id}>
            <div>
              {index + 1} - {e.text}
            </div>
            {e.todoStatus === "DONE" ? (
              <div>Done</div>
            ) : (
              <button onClick={() => changeStatus(e.id)}>Update status</button>
            )}
            <button onClick={() => deleteTodo(e.id)}>Delete</button>
          </div>
        );
      })}
      <div>-------------------------</div>
      <Modal />
    </div>
  );
}

export default App;
