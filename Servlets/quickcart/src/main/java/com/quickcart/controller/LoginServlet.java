package com.quickcart.controller;



import javax.servlet.ServletException;
import javax.servlet.http.*;

import java.io.IOException;

public class LoginServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        if ("gollaanand@quickcart.com".equals(email) && "1234".equals(password)) {

            // go to product servlet
            response.sendRedirect("product");

        } else {

            // go to error page
            request.getRequestDispatcher("error.jsp").forward(request, response);
        }
    }
}