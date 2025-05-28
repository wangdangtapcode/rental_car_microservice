package com.example.user_service.controller;


import com.example.user_service.model.Customer;
import com.example.user_service.model.User;
import com.example.user_service.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customers")
public class CustomerController {
    @Autowired
    private   CustomerService customerService;


    @PostMapping(value = "/add")
    public Customer createCustomer(@RequestBody User customerData){
        return customerService.createCustomer(customerData);
    }
    @GetMapping(value = "/search")
    public List<Customer> findByName(@RequestParam String fullName){
        return customerService.findByUserFullName(fullName);
    }

    @GetMapping(value = "/search/all")
    public List<Customer> findByName(){
        return customerService.findAll();
    }
}
