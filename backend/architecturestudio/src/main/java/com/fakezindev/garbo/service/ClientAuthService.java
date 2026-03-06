package com.fakezindev.garbo.service;

import com.fakezindev.garbo.dto.ClientLoginDTO;
import com.fakezindev.garbo.dto.ClientLoginResponseDTO;
import com.fakezindev.garbo.dto.ClientRegisterDTO;
import com.fakezindev.garbo.model.entities.Client;
import com.fakezindev.garbo.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClientAuthService {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public void register(ClientRegisterDTO dto) {

        if(clientRepository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("Já existe um usuário cadastrado com este e-mail.");
        }

        Client newClient = new Client();
        newClient.setName(dto.name());
        newClient.setEmail(dto.email());
        newClient.setPhone(dto.phone());
        newClient.setCpf(dto.cpf());

        newClient.setPassword(passwordEncoder.encode(dto.password()));

        clientRepository.save(newClient);
    }
    public ClientLoginResponseDTO login(ClientLoginDTO dto) {
        // 1. Busca o cliente pelo e-mail
        Client client = clientRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("E-mail ou senha inválidos."));

        // 2. Confere se a senha bate (Se você não usa senha criptografada ainda, mude para: if (!dto.password().equals(client.getPassword())) )
        if (!passwordEncoder.matches(dto.password(), client.getPassword())) {
            throw new RuntimeException("E-mail ou senha inválidos.");
        }

        // 3. Gera o Token JWT para esse cliente
        // (Talvez você precise criar esse metodo no seu TokenService se ele só aceitar o Admin)
        String token = tokenService.generateClientToken(client);

        // 4. Monta a resposta do jeito que o React está esperando
        ClientLoginResponseDTO.ClientInfo clientInfo = new ClientLoginResponseDTO.ClientInfo(
                client.getId(),
                client.getName(),
                client.getEmail()
        );

        return new ClientLoginResponseDTO(token, clientInfo);
    }
}
