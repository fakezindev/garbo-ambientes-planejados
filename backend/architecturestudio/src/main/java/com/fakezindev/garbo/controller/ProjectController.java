package com.fakezindev.garbo.controller;

import com.fakezindev.garbo.dto.ProjectRequestDTO;
import com.fakezindev.garbo.dto.ProjectResponseDTO;
import com.fakezindev.garbo.model.entities.Project;
import com.fakezindev.garbo.service.ProjectService;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponseDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("{id}")
    public ResponseEntity<ProjectResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/my-project")
    public ResponseEntity<ProjectResponseDTO> getMyProject(Authentication authentication) {
        String clientEmail = authentication.getName();
        List<Project> myProjects = service.findByClientEmail(clientEmail);

        if (myProjects != null && !myProjects.isEmpty()) {
            return ResponseEntity.ok(new ProjectResponseDTO(myProjects.get(0)));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponseDTO> create(
            @RequestPart("data") String dataJson, // 👈 Recebendo como String
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        try {
            // 👈 Mágica da conversão manual
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            ProjectRequestDTO dto = objectMapper.readValue(dataJson, ProjectRequestDTO.class);

            ProjectResponseDTO createdProject = service.create(dto, images);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar a requisição: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponseDTO> update(
            @PathVariable Long id,
            @RequestPart("data") String dataJson, // 👈 Recebendo como String
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        System.out.println("=========================================");
        System.out.println(">>> CHEGOU NO CONTROLLER DE ATUALIZAR!");
        System.out.println(">>> ID do Projeto: " + id);
        System.out.println(">>> Dados (JSON): " + dataJson);
        System.out.println(">>> Imagens recebidas: " + (images != null ? images.size() : "NENHUMA/NULA"));
        System.out.println("=========================================");

        try {
            // 👈 Mágica da conversão manual
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            ProjectRequestDTO dto = objectMapper.readValue(dataJson, ProjectRequestDTO.class);

            ProjectResponseDTO updatedProject = service.update(id, dto, images);
            return ResponseEntity.ok(updatedProject);
        } catch (Exception e) {
            System.err.println(">>> ERRO NO CONTROLLER: " + e.getMessage());
            throw new RuntimeException("Erro ao processar a requisição: " + e.getMessage());
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}