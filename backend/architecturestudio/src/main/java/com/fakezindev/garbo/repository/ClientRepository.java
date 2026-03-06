package com.fakezindev.garbo.repository;

import com.fakezindev.garbo.model.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    boolean existsByPhone(String phone);
}
