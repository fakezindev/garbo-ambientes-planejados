package com.fakezindev.architecturestudio.controller;

import com.fakezindev.architecturestudio.dto.ProjectRequestDTO;
import com.fakezindev.architecturestudio.dto.ProjectResponseDTO;
import com.fakezindev.architecturestudio.model.entities.Project;
import com.fakezindev.architecturestudio.service.ProjectService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

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
        // 1. Pega o e-mail do cliente que está escondido dentro do Token JWT
        String clientEmail = authentication.getName();

        // 2. Busca no banco todos os projetos atrelados a esse e-mail
        List<Project> myProjects = service.findByClientEmail(clientEmail);

        // 3. Se ele tiver projeto, devolve o primeiro (ou a lista). Aqui vamos devolver o primeiro para facilitar o Dashboard
        if (myProjects != null && !myProjects.isEmpty()) {
            return ResponseEntity.ok(new ProjectResponseDTO(myProjects.get(0)));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponseDTO> create(
            @RequestPart("data") String data,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            ProjectRequestDTO dto = objectMapper.readValue(data, ProjectRequestDTO.class);
            ProjectResponseDTO createdProject = service.create(dto, images);

            return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar a requisição: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectResponseDTO> update(
            @PathVariable Long id,
            @RequestPart("data") String data,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        // 👀 OLHOS DO DETETIVE: Isso vai imprimir no console do IntelliJ
        System.out.println("=========================================");
        System.out.println(">>> CHEGOU NO CONTROLLER DE ATUALIZAR!");
        System.out.println(">>> ID do Projeto: " + id);
        System.out.println(">>> Dados (JSON): " + data);
        System.out.println(">>> Imagens recebidas: " + (images != null ? images.size() : "NENHUMA/NULA"));
        System.out.println("=========================================");

        try {
            ObjectMapper objectMapper = new ObjectMapper();

            ProjectRequestDTO dto = objectMapper.readValue(data, ProjectRequestDTO.class);
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
