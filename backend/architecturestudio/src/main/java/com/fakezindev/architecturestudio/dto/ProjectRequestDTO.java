package com.fakezindev.architecturestudio.dto;

import com.fakezindev.architecturestudio.model.enums.ProjectCategory;

import java.time.LocalDate;

public record ProjectRequestDTO(
        String title,
        String description,
        ProjectCategory category,
        Long clientId,
        LocalDate completionDate
) {}