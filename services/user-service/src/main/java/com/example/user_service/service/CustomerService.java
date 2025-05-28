package com.example.user_service.service;
import com.example.user_service.model.Customer;
import com.example.user_service.model.User;
import com.example.user_service.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class CustomerService {


    @Autowired
    private  CustomerRepository customerRepository;

    @Transactional
    public Customer createCustomer(User customerData) {

        Customer customer = new Customer();
        customer.setUser(customerData);

        customerRepository.save(customer);

        return customerRepository.save(customer);
    }
    @Transactional
    public List<Customer> findByUserFullName(String fullName) {
        List<Customer> customers = customerRepository.findByUserFullNameContainingIgnoreCase(fullName);
        List<Customer> customerList = new ArrayList<>();
        for (Customer customer : customers) {
            customerList.add(customer);
        }
        return customerList;
    }
    @Transactional
    public List<Customer> findAll() {
        List<Customer> customers = customerRepository.findTop20ByOrderByIdAsc();
        List<Customer> customerList = new ArrayList<>();
        for (Customer customer : customers) {
            customerList.add(customer);
        }
        return customerList;
    }
}
