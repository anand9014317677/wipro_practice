package com.quickcart.controller;



import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.*;

public class ProductServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        List<String> products = Arrays.asList(
                "Asus Tuf F15",
                "Samsung Galaxy S23",
                "MacBook Air",
                "Sony Headphones",
                "Bonkers"
        );

        request.setAttribute("productList", products);

        request.getRequestDispatcher("dashboard.jsp").forward(request, response);
    }
}