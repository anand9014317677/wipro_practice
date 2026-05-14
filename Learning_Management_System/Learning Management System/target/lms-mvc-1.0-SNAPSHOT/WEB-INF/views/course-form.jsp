<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%@ taglib prefix="form"
           uri="http://www.springframework.org/tags/form" %>

<%@ taglib prefix="c"
           uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>

<html>

<head>

    <title>Add Course</title>

    <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            rel="stylesheet">

</head>

<body class="bg-light">

<div class="container mt-5">

    <div class="card shadow p-4">

        <h2 class="text-center mb-4">

            Add Course To Student

        </h2>

        <form:form
                action="save"
                method="post"
                modelAttribute="course">

            <!-- Course Name -->

            <div class="mb-3">

                <label class="form-label">
                    Course Title
                </label>

                <form:input
                        path="title"
                        cssClass="form-control"/>

            </div>

            <!-- Student Dropdown -->

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

            <button class="btn btn-success w-100">

                Save Course

            </button>

        </form:form>

    </div>

</div>

</body>

</html>