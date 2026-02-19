package com.fakezindev.architecturestudio.controller;

import com.fakezindev.architecturestudio.dto.ProjectRequestDTO;
import com.fakezindev.architecturestudio.dto.ProjectResponseDTO;
import com.fakezindev.architecturestudio.service.ProjectService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService service;
    private final ObjectMapper objectMapper;

    public ProjectController(ProjectService service, ObjectMapper objectMapper) {
        this.service = service;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponseDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("{id}")
    public ResponseEntity<ProjectResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponseDTO> create(@RequestPart("data") @Valid ProjectRequestDTO dto,
                                                     @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        var response = service.create(dto, images);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponseDTO> update(
            @PathVariable Long id,
            @RequestPart("data") String projectData,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        try {

            // Converte o JSON String para o Objeto Java
            ProjectRequestDTO dto = objectMapper.readValue(projectData, ProjectRequestDTO.class);

            ProjectResponseDTO response = service.update(id, dto, images);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Erro JSON: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
