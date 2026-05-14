<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ page import="java.util.*" %>

<!DOCTYPE html>
<html>
<head>
<title>Dashboard</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="container mt-5">

<h2 class="text-success">You have successfully logged in</h2>

<ul class="list-group mt-3">

<%
List<String> products = (List<String>) request.getAttribute("productList");

for(String p : products){
%>
    <li class="list-group-item"><%= p %></li>
<%
}
%>

</ul>

</body>
</html>