package com.example.user.service;



import com.example.user.exception.AadharAlreadyExistsException;
import com.example.user.exception.AgeNotFoundException;
import com.example.user.exception.PanAlreadyExistsException;
import com.example.user.model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    List<User> users = new ArrayList<>();

    public User saveUser(User user) {

        if (user.getAge() < 18) {
            throw new AgeNotFoundException("Age should be greater than 18");
        }

        boolean aadharExists = users.stream()
                .anyMatch(u -> u.getAadharNo().equals(user.getAadharNo()));

        if (aadharExists) {
            throw new AadharAlreadyExistsException("Aadhar already exists");
        }

        boolean panExists = users.stream()
                .anyMatch(u -> u.getPanNo().equals(user.getPanNo()));

        if (panExists) {
            throw new PanAlreadyExistsException("PAN already exists");
        }

        users.add(user);

        return user;
    }

    public List<User> getAllUsers() {

        return users;
    }
}