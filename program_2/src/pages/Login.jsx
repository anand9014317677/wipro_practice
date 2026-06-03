import { useNavigate } from "react-router-dom"

function Login() {

  const navigate = useNavigate()

  const handleLogin = (e) => {

    e.preventDefault()

    navigate("/courses")
  }

  return (

    <div className="row justify-content-center mt-4">

      <div className="col-md-4">

        <div className="card shadow">

          <div className="card-body">

            <h3 className="text-center mb-3">
              Login
            </h3>

            <form onSubmit={handleLogin}>

              <div className="mb-3">

                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  required
                />

              </div>

              <button
                className="btn btn-primary w-100"
                type="submit"
              >
                Login
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Login