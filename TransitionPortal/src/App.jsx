import { Link } from "react-router-dom";
import "./App.css";
import AnimatedRoutes from "./component/AnimatedRoutes";

function App() {

  return (
    <>

      <nav className="navbar">

        <Link to="/">Home</Link>

        <Link to="/employees">Employees</Link>

        <Link to="/courses">Courses</Link>

        <Link to="/admin">Admin</Link>

        <Link to="/login">Login</Link>

      </nav>

      <AnimatedRoutes />

    </>
  );
}

export default App;