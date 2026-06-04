import { useEffect, useState } from "react";

function CourseList() {

  const [courses, setCourses] = useState([]);

  useEffect(() => {

    fetch("http://localhost:3001/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch(() => console.log("Backend not running"));

  }, []);

  return (

    <div className="card">

      <h2>Courses (From Backend)</h2>

      {courses.map((course) => (

        <div className="course-box" key={course.id}>

          <h3>{course.name}</h3>

          <p>{course.duration}</p>

        </div>

      ))}

    </div>
  );
}

export default CourseList;