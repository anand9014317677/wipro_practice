<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%@ taglib prefix="c"
           uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>

<html>

<head>

    <title>View Students</title>

    <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            rel="stylesheet">

</head>

<body class="bg-light">

<div class="container mt-5">

    <div class="card shadow p-4">

        <h2 class="text-center mb-4">

            Student Enrollments

        </h2>

        <table class="table table-bordered">

            <thead class="table-dark">

            <tr>

                <th>ID</th>

                <th>Name</th>

                <th>Email</th>

                <th>Courses</th>

            </tr>

            </thead>

            <tbody>

            <c:forEach
                    var="student"
                    items="${students}">

                <tr>

                    <td>${student.id}</td>

                    <td>${student.name}</td>

                    <td>${student.email}</td>

                    <td>

                        <c:forEach
                                var="course"
                                items="${student.courses}">

                            <span class="badge bg-primary">

                                    ${course.title}

                            </span>

                        </c:forEach>

                    </td>

                </tr>

            </c:forEach>

            </tbody>

        </table>

    </div>

</div>

</body>

</html>