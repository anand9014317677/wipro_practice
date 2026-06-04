function withAuth(Component) {

  return function WrappedComponent(props) {

    const isLoggedIn = localStorage.getItem("loggedIn");

    if (!isLoggedIn) {
      return (
        <div style={{ padding: "20px" }}>
          <h2>You are not authorized</h2>
          <p>Please login first</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

export default withAuth;