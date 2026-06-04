import { useState } from "react";
import "./App.css";

function App() {

  const [count, setCount] = useState(10);

  const addEmployee = () => {
    setCount(count + 1);
  };

  const removeEmployee = () => {
    setCount(count - 1);
  };

  return (
    <div className="container">

      <h1>Employee Count</h1>

      <p>The value of counter variable is :</p>

      <h2>{count}</h2>

      <div className="btn-group">

        <button onClick={addEmployee}>
          Add Employee
        </button>

        <button onClick={removeEmployee}>
          Removing Employee
        </button>

      </div>

    </div>
  );
}

export default App;