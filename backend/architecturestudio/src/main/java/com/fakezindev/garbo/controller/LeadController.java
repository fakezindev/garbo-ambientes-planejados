package com.fakezindev.garbo.controller;

import com.fakezindev.garbo.dto.LeadRequestDTO;
import com.fakezindev.garbo.dto.LeadResponseDTO;
import com.fakezindev.garbo.model.entities.Lead;
import com.fakezindev.garbo.repository.LeadRepository;
import com.fakezindev.garbo.service.LeadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leads") // A porta exata que o React está chamando
public class LeadController {

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private LeadService leadService;

    @PostMapping
    public ResponseEntity<LeadResponseDTO> create(@RequestBody LeadRequestDTO dto) {
        LeadResponseDTO newLead = leadService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newLead);
    }

    @GetMapping
    public ResponseEntity<List<Lead>> listarTodos() {
        // Busca todos os leads no banco de dados
        List<Lead> leads = leadRepository.findAll();
        return ResponseEntity.ok(leads);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        leadService.delete(id);
        return ResponseEntity.noContent().build(); // Retorna status 204 (Sucesso sem conteúdo)
    }
}