package com.example.user_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String phoneNumber;
    private String email;
    private String password;
    private String address;
    private String userType;
    private String status;

    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private Customer customer;

    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private Employee employee;
}
