package com.fakezindev.garbo.service;

import com.fakezindev.garbo.dto.LeadRequestDTO;
import com.fakezindev.garbo.model.entities.Lead;
import com.fakezindev.garbo.model.enums.LeadStatus;
import com.fakezindev.garbo.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;

    public Lead savelead(LeadRequestDTO dto) {
        Lead lead = new Lead();
        lead.setStatus(LeadStatus.NOVO);
        lead.setName(dto.name());
        lead.setEmail(dto.email());
        lead.setPhone(dto.phone());
        lead.setEnvironment(dto.environment());
        return leadRepository.save(lead);
    }
}
