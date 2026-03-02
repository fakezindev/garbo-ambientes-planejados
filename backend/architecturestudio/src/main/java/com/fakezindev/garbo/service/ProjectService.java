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

        // 1. GESTÃO DE IMAGENS QUE JÁ EXISTIAM (O que o usuário manteve vs o que excluiu no "x")
        List<String> urlsNoBanco = project.getImageUrls() != null ? new ArrayList<>(project.getImageUrls()) : new ArrayList<>();
        List<String> urlsParaManter = dto.existingImageUrls() != null ? dto.existingImageUrls() : new ArrayList<>();

        // Identifica o que sumiu da lista (o que deve ser apagado fisicamente do MinIO)
        List<String> urlsParaDeletar = urlsNoBanco.stream()
                .filter(url -> !urlsParaManter.contains(url))
                .toList();

        // 🚨 A CORREÇÃO: Deletar apenas as fotos que foram removidas pelo "x"
        for (String urlToRemove : urlsParaDeletar) {
            try {
                String filename = URLDecoder.decode(urlToRemove.substring(urlToRemove.lastIndexOf("/") + 1), StandardCharsets.UTF_8);
                fileStorageService.delete(filename);
                System.out.println(">>> Imagem removida do MinIO: " + filename);
            } catch (Exception e) {
                System.err.println("Erro ao deletar imagem excluída: " + e.getMessage());
            }
        }

        // Atualiza a lista do banco apenas com as fotos que o usuário decidiu manter
        project.getImageUrls().clear();
        project.getImageUrls().addAll(urlsParaManter);

        // 2. GESTÃO DE NOVAS IMAGENS (Upload de novos arquivos selecionados no input)
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                try {
                    String newImageUrl = fileStorageService.upload(file);
                    project.getImageUrls().add(newImageUrl); // Adiciona no final da lista atual
                } catch (Exception e) {
                    System.err.println("Erro ao salvar nova imagem: " + e.getMessage());
                }
            }
        }

        // 3. ATUALIZAÇÃO DA CAPA (Garante que a capa seja sempre a primeira foto da lista final)
        if (!project.getImageUrls().isEmpty()) {
            project.setCoverImageUrl(project.getImageUrls().get(0));
        } else {
            project.setCoverImageUrl(null);
        }

        // 4. ATUALIZAÇÃO DOS DADOS TEXTUAIS (Título, Status, etc)
        convertDtoToEntity(dto, project);

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
        project.setStatus(dto.status() != null ? dto.status() : " EM PROJETO");

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