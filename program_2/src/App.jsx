import './App.css'

import { Routes, Route } from 'react-router-dom'

import Courses from './pages/Courses'
import Home from './pages/Home'
import CourseDetails from './pages/CourseDetails'
import ContactUs from './pages/ContactUs'
import Login from './pages/Login'

import Menu from './components/Menu'

import { useState } from 'react'

function App() {

  const [getStatus, setStatus] = useState(false)

  return (
    <>

      <Menu />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/courses"
          element={<Courses setStatus={setStatus} />}
        />

        <Route
          path="/courses/:id"
          element={<CourseDetails />}
        />

        <Route
          path="/contact"
          element={<ContactUs />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

      </Routes>

    </>
  )
}

export default App