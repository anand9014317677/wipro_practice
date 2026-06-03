package com.example.user.controller;


import com.example.user.model.User;
import com.example.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService service;

    @PostMapping("/add")
    public User addUser(
            @Valid @RequestBody User user) {

        return service.saveUser(user);
    }

    @GetMapping("/viewall")
    public List<User> getAllUsers() {

        return service.getAllUsers();
    }
}