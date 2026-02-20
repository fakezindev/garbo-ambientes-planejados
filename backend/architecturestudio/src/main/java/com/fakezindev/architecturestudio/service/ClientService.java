package com.fakezindev.architecturestudio.service;

import com.fakezindev.architecturestudio.dto.ClientDTO;
import com.fakezindev.architecturestudio.model.entities.Client;
import com.fakezindev.architecturestudio.repository.ClientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    public ClientService(ClientRepository clientRepository, PasswordEncoder passwordEncoder) {
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Client createClient(ClientDTO dto) {
        if (clientRepository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("Já existe um cliente cadastrado com este e-mail.");

        }
        Client client = new Client();
        client.setName(dto.name());
        client.setEmail(dto.email());
        client.setPassword(passwordEncoder.encode(dto.password()));
        client.setPhone(dto.phone());
        client.setAddress(dto.address());
        client.setCpfCnpj(dto.cpfCnpj());

        return clientRepository.save(client);
    }
}
