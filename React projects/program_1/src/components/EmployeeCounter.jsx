import React from 'react'
import { useState } from 'react'

// In react we have multiple hooks which are predefined functions
// like useState , useEffect , useRef

function EmployeeCounter() {

    // Here in a state you are setting an initial value as 1
    const [getCount , setCount] = useState(1);

    // useState :
    // It is used to store and update dynamic content

    return (

        <div className="bg-amber-400 p-6 rounded shadow w-80 text-center">

            <h1 className='text-2xl font-bold mb-4'>
                Employee Count
            </h1>

            {/* Dynamic value */}
            The value of counter variable is :

            <p className='text-3xl mb-6'>
                {getCount}
            </p>

            {/* Buttons */}

            <div className='flex gap-1'>

                <button
                    className="bg-red-700 text-white px-4 py-2 rounded hover:cursor-pointer"
                    onClick={() => setCount(getCount + 1)}
                >
                    Add Employee
                </button>

                <button
                    className="bg-red-700 text-white px-4 py-2 rounded hover:cursor-pointer"
                    onClick={() => setCount(getCount - 1)}
                    disabled={getCount == 0}
                >
                    Removing Employee
                </button>

            </div>

        </div>
    )
}

export default EmployeeCounter