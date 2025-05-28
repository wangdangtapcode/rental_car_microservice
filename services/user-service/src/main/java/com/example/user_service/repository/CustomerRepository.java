package com.example.user_service.repository;

import com.example.user_service.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findTop20ByOrderByIdAsc();
    List<Customer> findByUserFullNameContainingIgnoreCase(String fullName);
}
