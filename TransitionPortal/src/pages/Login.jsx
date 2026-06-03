function Login() {

  const login = () => {

    localStorage.setItem("loggedIn", "true");

    alert("Login Successful");
  };

  const logout = () => {

    localStorage.removeItem("loggedIn");

    alert("Logout Successful");
  };

  return (
    <div className="page">

      <h1>Login Page</h1>

      <button onClick={login} className="btn">
        Login
      </button>

      <button onClick={logout} className="btn logout">
        Logout
      </button>

    </div>
  );
}

export default Login;