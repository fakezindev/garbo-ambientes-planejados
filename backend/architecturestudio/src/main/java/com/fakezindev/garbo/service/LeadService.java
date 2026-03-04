package com.fakezindev.garbo.service;

import com.fakezindev.garbo.dto.LeadRequestDTO;
import com.fakezindev.garbo.dto.LeadResponseDTO;
import com.fakezindev.garbo.model.entities.Lead;
import com.fakezindev.garbo.repository.LeadRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;

    @Transactional
    public LeadResponseDTO create(LeadRequestDTO dto) {
        Lead lead = new Lead();
        lead.setName(dto.name());
        lead.setPhone(dto.phone());
        lead.setEmail(dto.email());
        lead.setService(dto.service());
        lead.setEnvironment(dto.environment());

        lead = leadRepository.save(lead);
        return new LeadResponseDTO(lead);
    }

    @Transactional
    public void delete(Long id) {
        leadRepository.deleteById(id);
    }
}
