package com.example.user_service.service;

import com.example.user_service.model.User;
import com.example.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    @Autowired
    private  UserRepository userRepository;

    public Object login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmailAndPassword(email, password);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
                return null;
            }

            if (user.getEmployee() != null) {
                return user.getEmployee();
            }

            if (user.getCustomer() != null) {
                return user.getCustomer();
            }
        }

        return null;
    }
}
