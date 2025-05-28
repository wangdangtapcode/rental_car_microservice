package com.example.payment_service.controller;

import com.example.payment_service.model.Invoice;
import com.example.payment_service.model.PenaltyRule;
import com.example.payment_service.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping(value = "/penalty-rules/all")
    public List<PenaltyRule> getAllPenaltyRule(){
        return paymentService.getAllPenaltyRule();
    }

    @PostMapping(value = "/invoice/create")
    public ResponseEntity<String> createInvoice(@RequestBody Invoice invoiceData) {

        boolean success = paymentService.createInvoice(invoiceData);

        if (success) {
            return ResponseEntity.ok("Tạo hóa đơn thành công");
        } else {
            return ResponseEntity.badRequest().body("Tạo hóa đơn thất bại");
        }
    }
}
