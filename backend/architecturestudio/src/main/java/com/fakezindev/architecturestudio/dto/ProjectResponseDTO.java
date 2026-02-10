package com.fakezindev.architecturestudio.dto;

import com.fakezindev.architecturestudio.model.entities.Project;
import com.fakezindev.architecturestudio.model.entities.ProjectImage;
import com.fakezindev.architecturestudio.model.enums.ProjectCategory;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor // Cria o construtor vazio (obrigatório para o JSON funcionar)
public class ProjectResponseDTO {
    private Long id;
    private String title;
    private String description;
    private ProjectCategory category;
    private String coverImageUrl;
    private List<String> allImageUrl;

    public ProjectResponseDTO(Project project) {
        this.id = project.getId();
        this.title = project.getTitle();
        this.description = project.getDescription();
        this.category = project.getCategory();

        // Converte a lista de Entidades (ProjectImage) para lista de Links (String)
        if (project.getImages() != null && !project.getImages().isEmpty()) {
            this.allImageUrl = project.getImages().stream()
                    .map(ProjectImage::getImageUrl) // Pega só o link de cada imagem
                    .collect(Collectors.toList());

            // Define a primeira imagem da lista como a Capa (Cover)
            this.coverImageUrl = this.allImageUrl.get(0);
        }
    }
}