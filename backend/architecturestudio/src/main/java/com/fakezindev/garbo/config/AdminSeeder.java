package com.fakezindev.garbo.config;

import com.fakezindev.garbo.model.entities.User;
import com.fakezindev.garbo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${api.admin.default.password:senha-segura-garbo-123}")
    private String defaultAdminPassword;

    @Override
    public void run(String... args) throws Exception {

        String adminUsername = "admin";

        if (!userRepository.existsByUsername(adminUsername)) {
            User admin = new User();
            admin.setUsername(adminUsername);

            admin.setPassword(passwordEncoder.encode(defaultAdminPassword));
            
            userRepository.save(admin);
            System.out.println("✅ [SEEDER] Usuário Administrador Master criado com sucesso! Username: " + adminUsername);
        } else {
            System.out.println("👌 [SEEDER] Usuário Administrador Master já existe. Nenhuma ação necessária.");
        }
    }
}
