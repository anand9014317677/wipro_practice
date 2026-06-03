package com.company.controller;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.company.model.Task;
import com.company.model.User;
import com.company.service.TaskService;
import com.company.service.UserServiceImpl;

@Controller
public class MainController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserServiceImpl userService;

    @GetMapping("/")
    public String showHomePage() {
        return "home";
    }

    @GetMapping("/register")
    public String showRegisterPage() {
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@RequestParam("username") String username,
                               @RequestParam("password") String password,
                               Model model) {

        User user = new User(username, password);
        String result = userService.registerUser(user);

        if (result.equals("User registered successfully!")) {
            return "redirect:/log";
        } else {
            model.addAttribute("message", result);
            return "register";
        }
    }

    @GetMapping("/log")
    public String showLoginPage() {
        return "login";
    }

    @PostMapping("/authenticate")
    public String AuthenticateUser(@RequestParam("username") String username,
                                   @RequestParam("pword") String password,
                                   Model model,
                                   HttpServletRequest req) {

        User u = new User(username, password);

        if (userService.findUser(u)) {
            HttpSession session = req.getSession();
            session.setAttribute("username", username);
            return "redirect:/service";
        }

        model.addAttribute("message", "Invalid Username/Password");
        return "display";
    }

    @GetMapping("/service")
    public String showServicePage(HttpServletRequest req, Model model) {

        HttpSession session = req.getSession(false);

        if (session != null && session.getAttribute("username") != null) {
            model.addAttribute("username", session.getAttribute("username"));
            return "service";
        }

        return "redirect:/log";
    }

    @GetMapping("/addtask")
    public String index(Model model) {
        model.addAttribute("tasks", taskService.getAllTasks());
        return "displayalltask";
    }

    @GetMapping("/add")
    public String addTaskForm(Model model) {
        model.addAttribute("task", new Task());
        return "add";
    }

    @PostMapping("/save")
    public String saveTask(@ModelAttribute Task task) {
        taskService.saveTask(task);
        return "redirect:/addtask";
    }
}