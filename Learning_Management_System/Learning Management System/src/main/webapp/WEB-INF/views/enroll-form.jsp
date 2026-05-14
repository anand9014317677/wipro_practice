<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%@ taglib prefix="c"
           uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>

<html>

<head>

    <title>Enroll Student</title>

    <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            rel="stylesheet">

</head>

<body class="bg-light">

<div class="container mt-5">

    <div class="card shadow p-4">

        <h2 class="text-center mb-4">

            Enroll Student Into Courses

        </h2>

        <form action="enroll" method="post">

            <div class="mb-3">

                <label class="form-label">
                    Select Student
                </label>

                <select
                        name="studentId"
                        class="form-select">

                    <c:forEach
                            var="student"
                            items="${students}">

                        <option value="${student.id}">

                                ${student.name}

                        </option>

                    </c:forEach>

                </select>

            </div>

            <div class="mb-3">

                <label class="form-label">
                    Select Courses
                </label>

                <br>

                <c:forEach
                        var="course"
                        items="${courses}">

                    <div class="form-check">

                        <input
                                class="form-check-input"

                                type="checkbox"

                                name="courseIds"

                                value="${course.id}">

                        <label class="form-check-label">

                                ${course.title}

                        </label>

                    </div>

                </c:forEach>

            </div>

            <button class="btn btn-warning w-100">

                Enroll Student

            </button>

        </form>

    </div>

</div>

</body>

</html>