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

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
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

    @Transactional // Importante: Garante que tudo seja feito ou nada feito
    public ProjectResponseDTO create(ProjectRequestDTO dto, List<MultipartFile> images) {
        // 1. Cria a entidade e preenche os dados básicos
        Project project = new Project();
        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setCategory(dto.getCategory());
        project.setClientName(dto.getClientName());
        project.setCompletionDate(dto.getCompletionDate());

        // 2. Salva a primeira vez para gerar o ID
        project = projectRepository.save(project);

        // 3. Processa a imagem (Se tiver)
        if (images != null && !images.isEmpty()) {
            MultipartFile file = images.get(0); // Pega a primeira imagem
            try {
                // Sobe pro MinIO
                String imageUrl = fileStorageService.upload(file);

                // Atualiza o projeto com a URL recebida
                project.setCoverImageUrl(imageUrl);

                // Salva de novo para persistir a URL no banco
                projectRepository.save(project);
                // ---------------------------

            } catch (Exception e) {
                // Se der erro no upload, a gente avisa mas não trava tudo (opcional)
                System.err.println("Erro ao salvar imagem: " + e.getMessage());
            }
        }

        return new ProjectResponseDTO(project);
    }

    public void delete(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado"));

        // --- LOGS DEDO-DURO ---
        System.out.println(">>> DEBUG: Entrou no delete do Service com ID: " + id);
        System.out.println(">>> DEBUG: URL da imagem encontrada: " + project.getCoverImageUrl());
        // ----------------------

        if (project.getCoverImageUrl() != null) {
            try {
                String url = project.getCoverImageUrl();
                String filename = url.substring(url.lastIndexOf("/") + 1);
                String decodedFilename = URLDecoder.decode(filename, StandardCharsets.UTF_8.toString());

                System.out.println(">>> DEBUG: Tentando deletar do S3 o arquivo: " + decodedFilename);
                fileStorageService.delete(decodedFilename);
            } catch (Exception e) {
                System.err.println(">>> DEBUG: Erro ao deletar imagem: " + e.getMessage());
            }
        } else {
            System.out.println(">>> DEBUG: Nenhuma imagem para deletar (URL é null).");
        }

        projectRepository.delete(project);
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
