package com.fakezindev.architecturestudio.controller;

import com.fakezindev.architecturestudio.dto.ClientLoginDTO;
import com.fakezindev.architecturestudio.dto.ClientLoginResponseDTO;
import com.fakezindev.architecturestudio.dto.ClientRegisterDTO;
import com.fakezindev.architecturestudio.service.ClientAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/client") // 👈 A mesma rota que configuramos no React
@RequiredArgsConstructor
public class ClientAuthController {

    private final ClientAuthService clientAuthService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody ClientRegisterDTO dto) {
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
