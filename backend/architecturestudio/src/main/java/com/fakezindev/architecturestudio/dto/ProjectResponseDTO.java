package com.fakezindev.architecturestudio.dto;

import com.fakezindev.architecturestudio.model.enums.ProjectCategory;
import lombok.Data;

import java.util.List;

@Data
public class ProjectResponseDTO {
    private Long id;
    private String title;
    private String description;
    private ProjectCategory category;
    private String coverImageUrl;
    private List<String> allImageUrl;
}
