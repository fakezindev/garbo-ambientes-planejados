package com.fakezindev.architecturestudio.controller;

import com.fakezindev.architecturestudio.model.entities.Lead;
import com.fakezindev.architecturestudio.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/leads") // A porta exata que o React está chamando
public class LeadController {

    @Autowired
    private LeadRepository leadRepository;

    @PostMapping
    public ResponseEntity<Lead> createLead(@RequestBody Lead lead) {
        // Recebe o pacote do React e salva direto no banco de dados!
        Lead savedLead = leadRepository.save(lead);
        return ResponseEntity.ok(savedLead);
    }
}