<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>


<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Form Page</title>
</head>

<body bgcolor="cyan">

<center>

<form action="GetFormData.jsp">

Enter name:
<input type="text" name="name">
<br><br>

Enter address :
<input type="text" name="address">
<br><br>

Course:

<select name="course">

<option value="Unknown">Select ....</option>

<option value="BTECH">Btech</option>

<option value="MTECH">Mtech</option>

</select>

<br><br>

Gender:

<input type="radio" name="gender" value="Male" checked>Male

<input type="radio" name="gender" value="Female">Female

<br><br>

Age

<input type="text" name="age" maxlength="2">

<br><br>

Enter your date of birth:

<input type="date" name="birth">

<br><br>

Hobbies:

<input type="checkbox" name="hobbies" value="Cricket">Cricket

<input type="checkbox" name="hobbies" value="Reading">Reading

<br><br>

<input type="submit" value="submitdata">

<input type="reset" value="Clear All">

</form>

</center>

</body>
</html>