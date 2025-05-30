package com.example.payment_service.controller;

import com.example.payment_service.model.Invoice;
import com.example.payment_service.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping(value = "/invoice/create")
    public Long createInvoice(@RequestBody Invoice invoiceData) {

        return paymentService.createInvoice(invoiceData);

    }
    @DeleteMapping(value = "/invoice/{id}")
    public boolean deleteInvoice(@PathVariable Long id) {
        return paymentService.deleteInvoice(id);
    }
}
