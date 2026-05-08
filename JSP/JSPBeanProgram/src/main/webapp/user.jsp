<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>User Verification</title>
</head>

<body>

<h1>Verifying Details</h1>

<jsp:useBean id="st" class="stud.ValidateUser"/>

<jsp:setProperty name="st" property="user"/>
<jsp:setProperty name="st" property="pass"/>

The Details Entered are as under
<br><br>

User Name :
<jsp:getProperty name="st" property="user"/>
<br><br>

Password :
<jsp:getProperty name="st" property="pass"/>
<br><br>

<%
if(st.validate("admin","123")) {
%>

Welcome ! you are a Valid user
<br>

<%
}
else {
%>

Error ! You are an invalid user
<br>

<%
}
%>

</body>
</html>