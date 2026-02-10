package com.fakezindev.architecturestudio.controller;

import com.fakezindev.architecturestudio.dto.ProjectRequestDTO;
import com.fakezindev.architecturestudio.dto.ProjectResponseDTO;
import com.fakezindev.architecturestudio.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService service;

    @GetMapping
    public ResponseEntity<List<ProjectResponseDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<ProjectResponseDTO> create(@RequestBody @Valid ProjectRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
