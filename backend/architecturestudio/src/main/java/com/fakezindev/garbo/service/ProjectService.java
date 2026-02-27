package com.fakezindev.garbo.service;

import com.fakezindev.garbo.dto.ProjectRequestDTO;
import com.fakezindev.garbo.dto.ProjectResponseDTO;
import com.fakezindev.garbo.exception.ResourceNotFoundException;
import com.fakezindev.garbo.model.entities.Project;
import com.fakezindev.garbo.repository.ClientRepository;
import com.fakezindev.garbo.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final FileStorageService fileStorageService;
    private final ClientRepository clientRepository;

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

        // Faz TODA a conversão de textos e cliente em uma linha só!
        convertDtoToEntity(dto, project);

        project = projectRepository.save(project);

        if (images != null && !images.isEmpty()) {
            List<String> uploadedUrls = new ArrayList<>();

            for (MultipartFile file : images) {
                try {
                    String imageUrl = fileStorageService.upload(file);
                    uploadedUrls.add(imageUrl);
                } catch (Exception e) {
                    System.err.println("Erro ao salvar imagem: " + e.getMessage());
                }
            }

            if (!uploadedUrls.isEmpty()) {
                project.setCoverImageUrl(uploadedUrls.get(0));

                // Inicializa a lista caso esteja nula e adiciona
                if (project.getImageUrls() == null) {
                    project.setImageUrls(new ArrayList<>());
                }
                project.getImageUrls().addAll(uploadedUrls);

                projectRepository.save(project);
            }
        }

        return new ProjectResponseDTO(project);
    }

    @Transactional
    public ProjectResponseDTO update(Long id, ProjectRequestDTO dto, List<MultipartFile> images) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        convertDtoToEntity(dto, project);

        if (images != null && !images.isEmpty()) {

            // 1. Apaga imagens antigas
            if (project.getImageUrls() != null && !project.getImageUrls().isEmpty()) {
                for (String oldUrl : project.getImageUrls()) {
                    try {
                        String oldFilename = URLDecoder.decode(oldUrl.substring(oldUrl.lastIndexOf("/") + 1), StandardCharsets.UTF_8);
                        fileStorageService.delete(oldFilename);
                    } catch (Exception e) {
                        System.err.println("Erro ao deletar imagem antiga: " + e.getMessage());
                    }
                }
            } else if (project.getCoverImageUrl() != null) {
                try {
                    String oldFilename = URLDecoder.decode(project.getCoverImageUrl().substring(project.getCoverImageUrl().lastIndexOf("/") + 1), StandardCharsets.UTF_8);
                    fileStorageService.delete(oldFilename);
                } catch (Exception e) {}
            }

            // 2. Faz Upload do novo carrossel
            List<String> uploadedUrls = new ArrayList<>();
            for (MultipartFile file : images) {
                try {
                    String imageUrl = fileStorageService.upload(file);
                    uploadedUrls.add(imageUrl);
                } catch (Exception e) {
                    System.err.println("Erro ao salvar nova imagem: " + e.getMessage());
                    e.printStackTrace();
                }
            }

            // 3. Atualiza o banco do jeito que o Hibernate gosta!
            if (!uploadedUrls.isEmpty()) {
                project.setCoverImageUrl(uploadedUrls.get(0));

                // 👇 A MÁGICA ESTÁ AQUI 👇
                if (project.getImageUrls() == null) {
                    project.setImageUrls(new ArrayList<>());
                }
                project.getImageUrls().clear(); // Limpa a lista monitorada
                project.getImageUrls().addAll(uploadedUrls); // Adiciona os itens novos nela
            }
        }

        project = projectRepository.save(project);
        return new ProjectResponseDTO(project);
    }

    @Transactional
    public void delete(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));

        if (project.getImageUrls() != null && !project.getImageUrls().isEmpty()) {
            for (String url : project.getImageUrls()) {
                try {
                    String filename = URLDecoder.decode(url.substring(url.lastIndexOf("/") + 1), StandardCharsets.UTF_8);
                    fileStorageService.delete(filename);
                } catch (Exception e) {
                    System.err.println("Erro ao deletar do MinIO: " + e.getMessage());
                }
            }
        }

        projectRepository.delete(project);
    }

    private void convertDtoToEntity(ProjectRequestDTO dto, Project project) {
        project.setTitle(dto.title());
        project.setDescription(dto.description());
        project.setCategory(dto.category());
        project.setCompletionDate(dto.completionDate());

        if (dto.clientId() != null) {
            var client = clientRepository.findById(dto.clientId())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado!"));
            project.setClient(client);
        } else {
            project.setClient(null);
        }
    }

    public List<Project> findByClientEmail(String email) {
        return projectRepository.findByClient_Email(email);
    }
}