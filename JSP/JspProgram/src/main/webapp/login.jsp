<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>




<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<title>Login</title>

</head>

<body class="container mt-5">

<form action="dashboard.jsp" method="post">

    <input type="email" 
           name="email" 
           class="form-control mb-3" 
           placeholder="Enter Email">

    <input type="password" 
           name="password" 
           class="form-control mb-3" 
           placeholder="Enter Password">

    <button class="btn btn-primary">
        Login
    </button>

</form>

</body>
</html>