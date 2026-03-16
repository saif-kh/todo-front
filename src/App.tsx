import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    async function getTodos() {
      const res = await fetch("http://localhost:8080/api/todos/all");
      const data = await res.json();
      setData(data);
    }
    getTodos();
  }, []);

  return <div>hello {data}</div>;
}

export default App;
