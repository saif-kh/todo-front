import { useEffect, useRef, useState } from "react";
import {
  ADD_TODO,
  CHANGE_TODO,
  DELETE_TODO,
  GET_TODOS,
} from "./constants/ApiUrls";
import axios from "axios";
import type { Todo } from "./constants/Types";
import {
  Ban,
  Check,
  CirclePlus,
  Frown,
  LoaderCircle,
  PenLine,
  Skull,
  Trash,
} from "lucide-react";

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
    const fixedText = text.charAt(0).toUpperCase() + text.slice(1);
    try {
      console.log(text);
      await axios.post(ADD_TODO, { text: fixedText });
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
        <div className="form_wrapper">
          <input
            autoFocus
            type="text"
            placeholder="Inser todo name"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleAdd}>Add</button>
        </div>
        <div className="error">{error}</div>
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
      await axios.delete(DELETE_TODO + id);
      let temp: Todo[] = todos.filter((e) => e.id !== id);
      setTodos([...temp]);
    } catch (error) {
      console.log(error);
    }
  }

  async function changeStatus(id: number) {
    try {
      await axios.get(CHANGE_TODO + id);
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
    <div className="main_container">
      <h1>My todos list</h1>
      <div className="form_wrapper">
        <input
          type="text"
          placeholder="Search for todo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={openModal}>
          Add Todo <CirclePlus size={20} />
        </button>
      </div>
      <div className="content_wrapper">
        {isError ? (
          <div className="edge_case">
            We having an error <Ban />
          </div>
        ) : isLoading ? (
          <div className="edge_case">
            Loading <LoaderCircle className="loading-icon" />
          </div>
        ) : todos?.length === 0 ? (
          <div className="edge_case">
            No todos so far <Skull />
          </div>
        ) : (
          search &&
          filteredTodos?.length === 0 && (
            <div className="edge_case">
              No todos match <Frown />
            </div>
          )
        )}
        {filteredTodos?.length !== 0 && (
          <div className="list_wrapper">
            {filteredTodos?.map((e, index) => {
              const isDisabled = e.todoStatus === "DONE";
              return (
                <div key={e.id} className="todo_wrapper">
                  <div className="text">
                    {index + 1} - {e.text}
                  </div>
                  <button
                    disabled={isDisabled}
                    className={`icon_holder ${isDisabled ? "done" : "update"}`}
                    onClick={() => changeStatus(e.id)}
                  >
                    {isDisabled ? <Check size={25} /> : <PenLine size={20} />}
                  </button>
                  <button
                    className="icon_holder delete"
                    onClick={() => deleteTodo(e.id)}
                  >
                    <Trash size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {isModalOpen && <Modal closeModal={closeModal} />}
    </div>
  );
}

export default App;
