<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Dashboard</title>
</head>
<body>

<jsp:include page="header.jsp"/>

<%
String email = request.getParameter("email");
String password = request.getParameter("password");

session.setAttribute("email", email);

if(email.isEmpty() || password.isEmpty())
{
	response.sendRedirect("error.jsp");
}
%>

<h2>Welcome, <%= email %></h2>

<br>

<a href="add.jsp">Add</a>

</body>
</html>