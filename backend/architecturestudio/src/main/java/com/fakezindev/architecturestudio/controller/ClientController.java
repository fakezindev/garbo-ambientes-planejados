package com.fakezindev.architecturestudio.controller;

import com.fakezindev.architecturestudio.dto.ClientDTO;
import com.fakezindev.architecturestudio.model.entities.Client;
import com.fakezindev.architecturestudio.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
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
