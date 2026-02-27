package com.fakezindev.garbo.dto;

import com.fakezindev.garbo.model.enums.ProjectCategory;

import java.time.LocalDate;

public record ProjectRequestDTO(
        String title,
        String description,
        ProjectCategory category,
        Long clientId,
        LocalDate completionDate
) {}