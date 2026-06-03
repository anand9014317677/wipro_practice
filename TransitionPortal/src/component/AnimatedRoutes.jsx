import { Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useRef } from "react";

import Home from "../pages/Home";
import Login from "../pages/Login";

import {
  ProtectAdmin,
  ProtectEmployee,
  ProtectCourses,
} from "../pages/ProtectedRoutes";

function AnimatedRoutes() {

  const location = useLocation();

  const nodeRef = useRef(null);

  return (
    <TransitionGroup>

      <CSSTransition
        key={location.pathname}
        timeout={400}
        classNames="fade"
        nodeRef={nodeRef}
      >

        <div ref={nodeRef}>

          <Routes location={location}>

            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/employees" element={<ProtectEmployee />} />

            <Route path="/courses" element={<ProtectCourses />} />

            <Route path="/admin" element={<ProtectAdmin />} />

          </Routes>

        </div>

      </CSSTransition>

    </TransitionGroup>
  );
}

export default AnimatedRoutes;