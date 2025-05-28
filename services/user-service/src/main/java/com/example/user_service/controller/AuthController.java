package com.example.user_service.controller;

import com.example.user_service.model.User;
import com.example.user_service.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    private  AuthService authService;

    @PostMapping(value = "/login")
    public Object login(@RequestBody User user) {
        return authService.login(user.getEmail(), user.getPassword());
    }
}
