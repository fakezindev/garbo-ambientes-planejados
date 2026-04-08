package com.fakezindev.garbo.controller;

import com.fakezindev.garbo.dto.ProjectRequestDTO;
import com.fakezindev.garbo.dto.ProjectResponseDTO;
import com.fakezindev.garbo.model.entities.Project;
import com.fakezindev.garbo.service.ProjectService;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
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

        // 1. Recebendo diretamente a lista de DTOs do serviço
        List<ProjectResponseDTO> myProjects = service.findByClientEmail(clientEmail);

        // Dica: O .toList() do Java nunca retorna null, então podemos tirar a checagem 'myProjects != null'
        if (!myProjects.isEmpty()) {
            // 2. O item .get(0) já é um ProjectResponseDTO, então passamos ele direto!
            return ResponseEntity.ok(myProjects.get(0));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponseDTO> create(
            @RequestPart("data") String dataJson, // 👈 Recebendo como String
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "videos", required = false) List<MultipartFile> videos
    ) {
        try {
            // 👈 Mágica da conversão manual
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            ProjectRequestDTO dto = objectMapper.readValue(dataJson, ProjectRequestDTO.class);

            ProjectResponseDTO createdProject = service.create(dto, images, videos);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar a requisição: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponseDTO> update(
            @PathVariable Long id,
            @RequestPart("data") String dataJson, // 👈 Recebendo como String
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "videos", required = false) List<MultipartFile> videos // 👈 NOVO: Recebendo os vídeos
    ) {
        log.info("=========================================");
        log.info(">>> CHEGOU NO CONTROLLER DE ATUALIZAR!");
        log.info(">>> ID do Projeto: {}", id);
        log.info(">>> Dados (JSON): {}", dataJson);
        log.info(">>> Imagens recebidas: {}", (images != null ? images.size() : "NENHUMA/NULA"));
        log.info(">>> Vídeos recebidos: {}", (videos != null ? videos.size() : "NENHUM/NULO"));
        log.info("=========================================");

        try {
            // Mágica da conversão manual
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            ProjectRequestDTO dto = objectMapper.readValue(dataJson, ProjectRequestDTO.class);

            // 👈 Passando a lista de vídeos para o Service
            ProjectResponseDTO updatedProject = service.update(id, dto, images, videos);

            return ResponseEntity.ok(updatedProject);
        } catch (Exception e) {
            log.error(">>> ERRO NO CONTROLLER: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao processar a requisição: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}