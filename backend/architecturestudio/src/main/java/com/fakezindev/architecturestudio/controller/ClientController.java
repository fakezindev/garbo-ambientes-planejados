package com.fakezindev.architecturestudio.controller;

import com.fakezindev.architecturestudio.dto.ClientDTO;
import com.fakezindev.architecturestudio.model.entities.Client;
import com.fakezindev.architecturestudio.repository.ClientRepository;
import com.fakezindev.architecturestudio.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
public class ClientController {

    private final ClientService clientService;
    private final ClientRepository clientRepository;

    public ClientController(ClientService clientService, ClientRepository clientRepository) {
        this.clientService = clientService;
        this.clientRepository = clientRepository;
    }

    @GetMapping
    public ResponseEntity<List<Client>> findAll() {
        return ResponseEntity.ok(clientRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Client> create(@RequestBody ClientDTO dto) {
        try {
            Client newClient = clientService.createClient(dto);
            return ResponseEntity.ok(newClient);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
