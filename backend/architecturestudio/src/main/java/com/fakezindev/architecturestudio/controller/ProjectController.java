package com.fakezindev.architecturestudio.controller;

import com.fakezindev.architecturestudio.dto.ProjectRequestDTO;
import com.fakezindev.architecturestudio.dto.ProjectResponseDTO;
import com.fakezindev.architecturestudio.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService service;

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

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
