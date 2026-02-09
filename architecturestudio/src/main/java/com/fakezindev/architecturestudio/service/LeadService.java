package com.fakezindev.architecturestudio.service;

import com.fakezindev.architecturestudio.dto.LeadRequestDTO;
import com.fakezindev.architecturestudio.model.entities.Lead;
import com.fakezindev.architecturestudio.model.enums.LeadStatus;
import com.fakezindev.architecturestudio.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;

    public Lead savelead(LeadRequestDTO dto) {
        Lead lead = new Lead();
        lead.setStatus(LeadStatus.NOVO);
        return leadRepository.save(lead);
    }
}
