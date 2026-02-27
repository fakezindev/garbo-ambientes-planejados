package com.fakezindev.garbo.controller;

import com.fakezindev.garbo.model.entities.Lead;
import com.fakezindev.garbo.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<Lead>> listarTodos() {
        // Busca todos os leads no banco de dados
        List<Lead> leads = leadRepository.findAll();
        return ResponseEntity.ok(leads);
    }
}