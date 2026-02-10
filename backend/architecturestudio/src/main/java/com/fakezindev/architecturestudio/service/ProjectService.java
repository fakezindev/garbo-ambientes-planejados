package com.fakezindev.architecturestudio.service;

import com.fakezindev.architecturestudio.dto.ProjectRequestDTO;
import com.fakezindev.architecturestudio.dto.ProjectResponseDTO;
import com.fakezindev.architecturestudio.model.entities.Project;
import com.fakezindev.architecturestudio.repository.ProjectImageRepository;
import com.fakezindev.architecturestudio.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectImageRepository imageRepository;

    public List<ProjectResponseDTO> findAll() {
        return projectRepository.findAll().stream()
                .map(this ::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectResponseDTO create(ProjectRequestDTO dto) {
        Project project = new Project();
        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setCategory(dto.getCategory());
        project.setClientName(dto.getClientName());
        project.setCompletionDate(dto.getCompletionDate());

        Project saved = projectRepository.save(project);
        return convertToDTO(saved);
    }

    private ProjectResponseDTO convertToDTO(Project project) {
        ProjectResponseDTO dto = new ProjectResponseDTO();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setCategory(project.getCategory());

        return dto;
    }
}
