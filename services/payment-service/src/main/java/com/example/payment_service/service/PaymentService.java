package com.example.payment_service.service;

import com.example.payment_service.model.Invoice;
import com.example.payment_service.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private InvoiceRepository invoiceRepository;


    @Transactional
    public Long createInvoice(Invoice invoiceData) {
        return invoiceRepository.save(invoiceData).getId();
    }

    @Transactional
    public boolean deleteInvoice(Long id) {
        if (invoiceRepository.existsById(id)) {
            invoiceRepository.deleteById(id);
            return true;
        }
        else {
            return false;
        }
    }
}
