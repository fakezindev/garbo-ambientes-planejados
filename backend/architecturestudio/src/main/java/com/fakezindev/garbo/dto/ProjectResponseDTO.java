package com.fakezindev.garbo.dto;

import com.fakezindev.garbo.model.entities.Project;
import com.fakezindev.garbo.model.enums.ProjectCategory;

import java.time.LocalDate;
import java.util.List;

public record ProjectResponseDTO(
        Long id,
        String title,
        String description,
        ProjectCategory category,
        String clientName,
        Long clientId,
        LocalDate completionDate,
        String coverImageUrl,
        List<String> imageUrls,
        List<String> videoUrls,
        String status
) {
    public ProjectResponseDTO(Project project) {
        this(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getCategory(),
                project.getClient() != null ? project.getClient().getName() : null,
                project.getClient() != null ? project.getClient().getId() : null,
                project.getCompletionDate(),
                project.getCoverImageUrl(),
                project.getImageUrls(),
                project.getVideoUrls(),
                project.getStatus()
        );
    }
}