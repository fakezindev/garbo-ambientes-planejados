package com.fakezindev.architecturestudio.dto;

import com.fakezindev.architecturestudio.model.entities.Project;
import com.fakezindev.architecturestudio.model.enums.ProjectCategory;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor // Cria o construtor vazio (obrigatório para o JSON funcionar)
public class ProjectResponseDTO {
    private Long id;
    private String title;
    private String description;
    private ProjectCategory category;
    private String clientName;
    private LocalDate completionDate;
    private String coverImageUrl;
    private List<String> allImageUrl;

    public ProjectResponseDTO(Project project) {
        this.id = project.getId();
        this.title = project.getTitle();
        this.description = project.getDescription();
        this.category = project.getCategory();
        this.clientName = project.getClientName();
        this.completionDate = project.getCompletionDate();
        this.coverImageUrl = project.getCoverImageUrl();
    }
}