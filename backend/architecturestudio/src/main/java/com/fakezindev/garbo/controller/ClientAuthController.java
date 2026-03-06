package com.fakezindev.garbo.controller;

import com.fakezindev.garbo.dto.ClientLoginDTO;
import com.fakezindev.garbo.dto.ClientLoginResponseDTO;
import com.fakezindev.garbo.dto.ClientRegisterDTO;
import com.fakezindev.garbo.repository.ClientRepository;
import com.fakezindev.garbo.service.ClientAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/client") // 👈 A mesma rota que configuramos no React
@RequiredArgsConstructor
public class ClientAuthController {

    private final ClientAuthService clientAuthService;
    private final ClientRepository clientRepository;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody ClientRegisterDTO dto) {

        // 🚨 1. Verifica E-mail
        if (clientRepository.existsByEmail(dto.email())) {
            return ResponseEntity.badRequest().body("Este e-mail já está cadastrado no sistema.");
        }

        // 🚨 2. Verifica CPF
        if (clientRepository.existsByCpf(dto.cpf())) {
            return ResponseEntity.badRequest().body("Este CPF já está vinculado a outra conta.");
        }

        // 🚨 3. Verifica WhatsApp/Telefone
        if (clientRepository.existsByPhone(dto.phone())) {
            return ResponseEntity.badRequest().body("Este número de WhatsApp já está cadastrado.");
        }
        try {
            clientAuthService.register(dto);
            return ResponseEntity.status(201).body("Cliente cadastrado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ClientLoginResponseDTO> login(@RequestBody ClientLoginDTO dto) {
        try {
            ClientLoginResponseDTO response = clientAuthService.login(dto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Se der erro de senha, devolve 401 (Não Autorizado) pro React mostrar a mensagem vermelha
            return ResponseEntity.status(401).build();
        }
    }
}
