<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Add Page</title>
</head>
<body>

<%! 
int a =30 , b = 40 ;
String s  = "Hi ! Your email id is :";
%>

<%
String email = (String)session.getAttribute("email");
%>

<h2><%= s.toUpperCase() %> <%= email %></h2>

<h3>Sum of two numbers : <%= (a+b) %></h3>

</body>
</html>