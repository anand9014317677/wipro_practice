import { useRef, useState } from "react";

export default function RegistrationForm({ setIsLoggedIn }) {

  const emailRef = useRef();

  const passwordRef = useRef();

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");

    const email = emailRef.current.value;

    const password = passwordRef.current.value;

    // Fetch users from backend
    const response = await fetch("http://localhost:3001/users");

    const users = await response.json();

    // Find valid user
    const validUser = users.find(

      (user) =>
        user.email === email &&
        user.password === password

    );

    if (validUser) {

      setMessage("Login Successful");

      setIsLoggedIn(true);

    } else {

      setMessage("Invalid Credentials");
    }

    e.target.reset();
  };

  return (

    <div className="card">

      <h2>Login Form</h2>

      <form onSubmit={handleSubmit}>

        <input
          ref={emailRef}
          type="text"
          placeholder="Enter Email"
        />

        <input
          ref={passwordRef}
          type="password"
          placeholder="Enter Password"
        />

        <button type="submit">
          Login
        </button>

      </form>

      {message && <p>{message}</p>}

    </div>
  );
}