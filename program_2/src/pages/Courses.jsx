import React from 'react'

import { Link } from 'react-router-dom'

function Courses() {

  return (

    <div className='text-center mt-3'>

      <ul style={{ listStyle: "none" }}>

        <li>
          <Link to='/courses/1'>
            React Course
          </Link>
        </li>

        <li>
          <Link to='/courses/2'>
            Java Course
          </Link>
        </li>

      </ul>

    </div>
  )
}

export default Courses