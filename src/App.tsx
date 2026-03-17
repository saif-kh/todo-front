import { useEffect, useRef, useState } from "react";
import {
  ADD_TODO,
  CHANGE_TODO,
  DELETE_TODO,
  GET_TODOS,
} from "./constants/ApiUrls";
import axios from "axios";
import type { Todo } from "./constants/Types";

const EMPTY_FIELD_ERROR = "Field can't be empty !!";
const SERVER_ERROR = "A problem occured, try again later.";

function Modal({ closeModal }: { closeModal: () => void }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  async function handleAdd() {
    if (!text) {
      setError(EMPTY_FIELD_ERROR);
      return;
    }
    try {
      console.log(text);
      const { data } = await axios.post(ADD_TODO, { text });
      alert("Todo added !!");
      setError("");
    } catch (e) {
      setError(SERVER_ERROR);
    } finally {
      closeModal();
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        closeModal();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="modal_wrapper">
      <div className="modal" ref={ref}>
        <h3>What's your todo ?</h3>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="error">{error}</div>
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function getTodos() {
      try {
        const res = await axios.get(GET_TODOS);
        setTodos(res?.data);
        setFilteredTodos(res?.data);
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

  useEffect(() => {
    if (search) {
      const temp = todos.filter((e) => e.text.includes(search));
      setFilteredTodos([...temp]);
    } else {
      setFilteredTodos([...todos]);
    }
  }, [search]);

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

  function closeModal() {
    setIsModalOpen(false);
  }

  function openModal() {
    setIsModalOpen(true);
  }

  return (
    <div>
      <h1>My todos</h1>
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={openModal}>Add Todo</button>
      </div>
      <div>-------------------------</div>
      {isError ? (
        <div>We having an error</div>
      ) : isLoading ? (
        <div>Loading ...</div>
      ) : todos?.length === 0 ? (
        <div>No todos so far</div>
      ) : (
        <div>No todos match</div>
      )}
      {filteredTodos?.map((e, index) => {
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
      {isModalOpen && <Modal closeModal={closeModal} />}
    </div>
  );
}

export default App;
