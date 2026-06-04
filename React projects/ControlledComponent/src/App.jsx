import "./App.css";

import { useState } from "react";

import RegistrationForm from "./components/RegistrationForm";
import CourseList from "./components/CourseList";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (

    <div>

      <RegistrationForm setIsLoggedIn={setIsLoggedIn} />

      {isLoggedIn && <CourseList />}

    </div>
  );
}

export default App;