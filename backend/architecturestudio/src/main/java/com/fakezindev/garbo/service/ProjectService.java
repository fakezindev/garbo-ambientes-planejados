package com.fakezindev.garbo.service;



import com.fakezindev.garbo.dto.ProjectRequestDTO;

import com.fakezindev.garbo.dto.ProjectResponseDTO;

import com.fakezindev.garbo.exception.ResourceNotFoundException;

import com.fakezindev.garbo.model.entities.Project;

import com.fakezindev.garbo.repository.ClientRepository;

import com.fakezindev.garbo.repository.ProjectRepository;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;

import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;



import java.net.URLDecoder;

import java.nio.charset.StandardCharsets;

import java.util.ArrayList;

import java.util.List;



@Slf4j
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
    public ProjectResponseDTO create(ProjectRequestDTO dto, List<MultipartFile> images, List<MultipartFile> videos) {
        Project project = new Project();

        // 1. Converte os dados textuais
        convertDtoToEntity(dto, project);

        // 2. Faz o upload das imagens ANTES de salvar no banco
        if (images != null && !images.isEmpty()) {
            List<String> uploadedUrls = new ArrayList<>();
            for (MultipartFile file : images) {
                try {
                    uploadedUrls.add(fileStorageService.upload(file));
                } catch (Exception e) {
                    log.error("Erro ao salvar imagem no MinIO: {}", e.getMessage(), e);
                }
            }

            if (!uploadedUrls.isEmpty()) {
                project.setCoverImageUrl(uploadedUrls.get(0));
                project.setImageUrls(uploadedUrls);
            }
        }

        // 2. Faz o upload das imagens ANTES de salvar no banco
        if (videos != null && !videos.isEmpty()) {
            List<String> uploadedVideoUrls = new ArrayList<>();
            for (MultipartFile file : videos) {
                try {
                    uploadedVideoUrls.add(fileStorageService.upload(file));
                } catch (Exception e) {
                    log.error("Erro ao salvar vídeo no MinIO: {}", e.getMessage(), e);
                }
            }

            if (!uploadedVideoUrls.isEmpty()) {
                project.setVideoUrls(uploadedVideoUrls); // Salva na lista de vídeos recém-criada
            }
        }

        // 3. Salva no banco APENAS UMA VEZ, já com as URLs preenchidas!
        project = projectRepository.save(project);

        return new ProjectResponseDTO(project);
    }

    @Transactional
    public ProjectResponseDTO update(Long id, ProjectRequestDTO dto, List<MultipartFile> images, List<MultipartFile> videos) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id));

        // ==========================================
        // 1. GESTÃO DE IMAGENS
        // ==========================================
        List<String> imagensNoBanco = project.getImageUrls() != null ? new ArrayList<>(project.getImageUrls()) : new ArrayList<>();
        List<String> imagensParaManter = dto.existingImageUrls() != null ? dto.existingImageUrls() : new ArrayList<>();

        // Deleta do MinIO as fotos que o usuário excluiu
        imagensNoBanco.stream()
                .filter(url -> !imagensParaManter.contains(url))
                .forEach(this::deleteMediaFromStorage);

        project.getImageUrls().clear();
        project.getImageUrls().addAll(imagensParaManter);

        // Upload das novas imagens
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                try {
                    project.getImageUrls().add(fileStorageService.upload(file));
                } catch (Exception e) {
                    log.error("Erro ao salvar nova imagem no MinIO: {}", e.getMessage(), e);
                }
            }
        }

        // ==========================================
        // 2. GESTÃO DE VÍDEOS (Lógica Nova!)
        // ==========================================
        List<String> videosNoBanco = project.getVideoUrls() != null ? new ArrayList<>(project.getVideoUrls()) : new ArrayList<>();
        // Presume que você adicionou List<String> existingVideoUrls no seu DTO
        List<String> videosParaManter = dto.existingVideoUrls() != null ? dto.existingVideoUrls() : new ArrayList<>();

        // Deleta do MinIO os vídeos que o usuário excluiu
        videosNoBanco.stream()
                .filter(url -> !videosParaManter.contains(url))
                .forEach(this::deleteMediaFromStorage);

        project.getVideoUrls().clear();
        project.getVideoUrls().addAll(videosParaManter);

        // Upload dos novos vídeos
        if (videos != null && !videos.isEmpty()) {
            for (MultipartFile file : videos) {
                try {
                    project.getVideoUrls().add(fileStorageService.upload(file));
                } catch (Exception e) {
                    log.error("Erro ao salvar novo vídeo no MinIO: {}", e.getMessage(), e);
                }
            }
        }

        // ==========================================
        // 3. ATUALIZAÇÃO DA CAPA E DADOS TEXTUAIS
        // ==========================================
        // A capa continua olhando APENAS para a lista de imagens
        project.setCoverImageUrl(project.getImageUrls().isEmpty() ? null : project.getImageUrls().get(0));

        convertDtoToEntity(dto, project);

        project = projectRepository.save(project);
        return new ProjectResponseDTO(project);
    }

    @Transactional
    public void delete(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado com ID: " + id));

        // Deleta todas as imagens do MinIO
        if (project.getImageUrls() != null) {
            project.getImageUrls().forEach(this::deleteMediaFromStorage);
        }

        // Deleta todos os vídeos do MinIO
        if (project.getVideoUrls() != null) {
            project.getVideoUrls().forEach(this::deleteMediaFromStorage);
        }

        projectRepository.delete(project);
    }

    // Metodo auxiliar (renomeado para ficar genérico para imagens e vídeos)
    private void deleteMediaFromStorage(String urlToRemove) {
        try {
            String filename = URLDecoder.decode(urlToRemove.substring(urlToRemove.lastIndexOf("/") + 1), StandardCharsets.UTF_8);
            fileStorageService.delete(filename);
            log.info(">>> Mídia removida do MinIO: {}", filename);
        } catch (Exception e) {
            log.error("Erro ao deletar mídia excluída do MinIO: {}", e.getMessage(), e);
        }
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



    public List<ProjectResponseDTO> findByClientEmail(String email) {

        return projectRepository.findByClient_Email(email).stream()
                .map(ProjectResponseDTO::new)
                .toList();
    }

}