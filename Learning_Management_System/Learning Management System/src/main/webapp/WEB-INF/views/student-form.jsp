<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%@ taglib prefix="form"
           uri="http://www.springframework.org/tags/form" %>

<!DOCTYPE html>

<html>

<head>

    <title>Add Student</title>

    <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            rel="stylesheet">

</head>

<body class="bg-light">

<div class="container mt-5">

    <div class="card shadow p-4">

        <h2 class="text-center mb-4">

            Register Student

        </h2>

        <form:form
                action="save"
                method="post"
                modelAttribute="student">

            <div class="mb-3">

                <label class="form-label">
                    Student Name
                </label>

                <form:input
                        path="name"
                        cssClass="form-control"/>

            </div>

            <div class="mb-3">

                <label class="form-label">
                    Student Email
                </label>

                <form:input
                        path="email"
                        cssClass="form-control"/>

            </div>

            <button class="btn btn-primary w-100">

                Save Student

            </button>

        </form:form>

    </div>

</div>

</body>

</html>