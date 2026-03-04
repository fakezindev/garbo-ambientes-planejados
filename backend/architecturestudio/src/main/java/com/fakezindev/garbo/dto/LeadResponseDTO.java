package com.fakezindev.garbo.dto;

import com.fakezindev.garbo.model.entities.Lead;

public record LeadResponseDTO(
        Long id,
        String name,
        String phone,
        String email,
        String service,
        String message
) {
    // 🪄 A MÁGICA: Construtor prático para converter a Entidade direto no DTO
    public LeadResponseDTO(Lead lead) {
        this(
                lead.getId(),
                lead.getName(),
                lead.getPhone(),
                lead.getEmail(),
                lead.getService(),
                lead.getEnvironment()
        );
    }
}
