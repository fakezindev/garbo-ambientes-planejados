package com.fakezindev.architecturestudio.controller;

import com.fakezindev.architecturestudio.dto.LeadRequestDTO;
import com.fakezindev.architecturestudio.dto.ProjectRequestDTO;
import com.fakezindev.architecturestudio.dto.ProjectResponseDTO;
import com.fakezindev.architecturestudio.service.LeadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService service;

    @PostMapping
    public ResponseEntity<ProjectResponseDTO> create(@RequestBody @Valid LeadRequestDTO dto) {
        service.savelead(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
