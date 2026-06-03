function ChildComponent() {

  const userName = "Jhon Doe";
  const age = 30;
  const isAdmin = true;

  return (
    <div>

      <h2>Child Component</h2>

      <p>Username: {userName}</p>

      <p>Age: {age}</p>

      <p>Is Admin: {isAdmin ? "Yes" : "No"}</p>

    </div>
  );

}

export default ChildComponent;