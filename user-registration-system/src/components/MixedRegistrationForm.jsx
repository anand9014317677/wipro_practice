import React, { useRef, useState } from "react";

function MixedRegistrationForm() {

  // useRef for input fields
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  // useState for errors and status
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  // Validation Function
  const validate = () => {

    let validationErrors = {};
    let isValid = true;

    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    // First Name Validation
    if (!firstName || !/^[A-Za-z]+$/.test(firstName)) {
      validationErrors.firstName =
        "Enter valid first name";
      isValid = false;
    }

    // Last Name Validation
    if (!lastName || !/^[A-Za-z]+$/.test(lastName)) {
      validationErrors.lastName =
        "Enter valid last name";
      isValid = false;
    }

    // Email Validation
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailPattern.test(email)) {
      validationErrors.email =
        "Invalid email format";
      isValid = false;
    }

    // Password Validation
    const passPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&*!]).{8,}$/;

    if (!password || !passPattern.test(password)) {
      validationErrors.password =
        "Password must contain uppercase, lowercase, number and special character";
      isValid = false;
    }

    setErrors(validationErrors);

    return isValid;
  };

  // Submit Handler
  const handleSubmit = (e) => {

    e.preventDefault();

    if (validate()) {

      setStatus("Registration Successful");

      // clear fields
      firstNameRef.current.value = "";
      lastNameRef.current.value = "";
      emailRef.current.value = "";
      passwordRef.current.value = "";

      setErrors({});

    } else {

      setStatus("Form Submission Failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>User Registration System</h2>

      <form onSubmit={handleSubmit}>

        {/* First Name */}
        <div>
          <input
            type="text"
            placeholder="First Name"
            ref={firstNameRef}
          />

          <p style={{ color: "red" }}>
            {errors.firstName}
          </p>
        </div>

        {/* Last Name */}
        <div>
          <input
            type="text"
            placeholder="Last Name"
            ref={lastNameRef}
          />

          <p style={{ color: "red" }}>
            {errors.lastName}
          </p>
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
          />

          <p style={{ color: "red" }}>
            {errors.email}
          </p>
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Password"
            ref={passwordRef}
          />

          <p style={{ color: "red" }}>
            {errors.password}
          </p>
        </div>

        <button type="submit">
          Register
        </button>

      </form>

      <h3>{status}</h3>

    </div>
  );
}

export default MixedRegistrationForm;