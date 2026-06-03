import React from 'react'

import { Link } from 'react-router-dom'

function Menu() {
  return (

    <div className='container mt-4 text-center'>

      <h1>Link Tag</h1>

      <div className='bg-light p-3 mt-3'>

        <Link to="/">Home</Link>

        {" | "}

        <Link to="/login">Login</Link>

        {" | "}

        <Link to="/courses">Courses</Link>

        {" | "}

        <Link to="/contact">Contact Us</Link>

      </div>

    </div>
  )
}

export default Menu