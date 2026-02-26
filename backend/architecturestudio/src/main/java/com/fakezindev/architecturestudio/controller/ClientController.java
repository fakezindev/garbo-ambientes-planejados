package com.fakezindev.architecturestudio.controller;

import com.fakezindev.architecturestudio.dto.ClientDTO;
import com.fakezindev.architecturestudio.model.entities.Client;
import com.fakezindev.architecturestudio.repository.ClientRepository;
import com.fakezindev.architecturestudio.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
public class ClientController {

    @Autowired
    private PasswordEncoder passwordEncoder;

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

    @PutMapping("/{id}")
    public ResponseEntity<Client> update(@PathVariable Long id, @RequestBody Client dadosAtualizados) {
        return clientRepository.findById(id)
                .map(clienteExistente -> {
                    clienteExistente.setName(dadosAtualizados.getName());
                    clienteExistente.setEmail(dadosAtualizados.getEmail());
                    clienteExistente.setPhone(dadosAtualizados.getPhone());

                    if (dadosAtualizados.getPassword() != null && !dadosAtualizados.getPassword().trim().isEmpty()) {
                        clienteExistente.setPassword(passwordEncoder.encode(dadosAtualizados.getPassword()));
                    }
                    
                    Client clientSalvo = clientRepository.save(clienteExistente);
                    return ResponseEntity.ok(clientSalvo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Client> delete(@PathVariable Long id) {
        if(clientRepository.existsById(id)) {
            clientRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
