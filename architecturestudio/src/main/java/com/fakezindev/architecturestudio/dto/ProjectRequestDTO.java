package com.fakezindev.architecturestudio.dto;

import com.fakezindev.architecturestudio.model.enums.ProjectCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjectRequestDTO {

    @NotBlank(message = "O titulo é obrigatório")
    private String title;

    private String description;

    @NotNull(message = "A categoria é obrigatória")
    private ProjectCategory category;

    private String clientName;
    private LocalDate completionDate;
}
