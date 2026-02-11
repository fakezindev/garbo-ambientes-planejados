package com.fakezindev.architecturestudio.service;

import com.fakezindev.architecturestudio.dto.ProjectRequestDTO;
import com.fakezindev.architecturestudio.dto.ProjectResponseDTO;
import com.fakezindev.architecturestudio.exception.ResourceNotFoundException;
import com.fakezindev.architecturestudio.model.entities.Project;
import com.fakezindev.architecturestudio.model.entities.ProjectImage;
import com.fakezindev.architecturestudio.repository.ProjectImageRepository;
import com.fakezindev.architecturestudio.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectImageRepository projectImageRepository;
    private final FileStorageService fileStorageService;

    public List<ProjectResponseDTO> findAll() {
        return projectRepository.findAll(Sort.by(Sort.Direction.DESC, "id")).stream()
                .map(ProjectResponseDTO::new)
                .toList();
    }

    public ProjectResponseDTO findById(Long id) {
        return projectRepository.findById(id)
                .map(ProjectResponseDTO::new)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID:" + id));
    }

    @Transactional
    public ProjectResponseDTO create(ProjectRequestDTO dto, List<MultipartFile> images) {
        Project project = new Project();
        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setCategory(dto.getCategory());
        project.setClientName(dto.getClientName());
        project.setCompletionDate(dto.getCompletionDate());

        project = projectRepository.save(project);

        // 2. Processar as Imagens (Se houver)
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                // A. Upload para o MinIO
                String imageUrl = fileStorageService.upload(file);

                // B. Salvar o link no banco
                ProjectImage imageEntity = new ProjectImage();
                imageEntity.setProject(project);
                imageEntity.setImageUrl(imageUrl);

                projectImageRepository.save(imageEntity);
            }
        }
        return new ProjectResponseDTO(project);
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
