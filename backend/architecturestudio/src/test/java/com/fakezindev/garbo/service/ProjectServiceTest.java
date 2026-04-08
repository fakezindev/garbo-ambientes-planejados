package com.fakezindev.garbo.service;

import com.fakezindev.garbo.dto.ProjectRequestDTO;
import com.fakezindev.garbo.dto.ProjectResponseDTO;
import com.fakezindev.garbo.exception.ResourceNotFoundException;
import com.fakezindev.garbo.model.entities.Client;
import com.fakezindev.garbo.model.entities.Project;
import com.fakezindev.garbo.model.enums.ProjectCategory;
import com.fakezindev.garbo.repository.ClientRepository;
import com.fakezindev.garbo.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @InjectMocks
    private ProjectService projectService;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private ClientRepository clientRepository;

    private Project project;
    private Client client;
    private ProjectRequestDTO requestDTO;
    private MockMultipartFile mockFile;

    @BeforeEach
    void setUp() {
        client = new Client();
        client.setId(1L);
        client.setEmail("cliente@teste.com");

        project = new Project();
        project.setId(10L);
        project.setTitle("Projeto Teste");
        project.setClient(client);
        // Inicializando como ArrayList mutável para evitar UnsupportedOperationException
        project.setImageUrls(new ArrayList<>(List.of("http://minio/bucket/img1.jpg", "http://minio/bucket/img2.jpg")));

        requestDTO = new ProjectRequestDTO(
                "Novo Título",                             // 1. title
                "Descrição",                               // 2. description
                ProjectCategory.MOVEIS_PLANEJADOS,        // 3. category
                1L,                                        // 4. clientId (Mudou para a 4ª posição)
                LocalDate.now(),                           // 5. completionDate (Mudou para a 5ª posição)
                "EM PROJETO",                              // 6. status (Mudou para a 6ª posição)
                List.of("http://minio/bucket/img1.jpg")    // 7. existingImageUrls
        );

        mockFile = new MockMultipartFile("file", "nova_img.jpg", "image/jpeg", "imagem".getBytes());
    }

    @Test
    @DisplayName("Deve retornar lista de DTOs ao buscar todos os projetos")
    void findAll_ShouldReturnDtoList() {
        when(projectRepository.findAll(any(Sort.class))).thenReturn(List.of(project));

        List<ProjectResponseDTO> result = projectService.findAll();

        assertThat(result).hasSize(1);
        verify(projectRepository, times(1)).findAll(any(Sort.class));
    }

    @Test
    @DisplayName("Deve retornar DTO ao buscar projeto existente por ID")
    void findById_ShouldReturnDto_WhenProjectExists() {
        when(projectRepository.findById(10L)).thenReturn(Optional.of(project));

        ProjectResponseDTO result = projectService.findById(10L);

        assertThat(result).isNotNull();
        verify(projectRepository, times(1)).findById(10L);
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException ao buscar projeto inexistente")
    void findById_ShouldThrowException_WhenProjectDoesNotExist() {
        when(projectRepository.findById(10L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> projectService.findById(10L));
    }

    @Test
    @DisplayName("Deve criar projeto, fazer upload de imagens e salvar apenas uma vez")
    void create_ShouldCreateProjectAndUploadImages() throws Exception {
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(fileStorageService.upload(any(MultipartFile.class))).thenReturn("http://minio/bucket/nova_img.jpg");
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        List<MultipartFile> files = List.of(mockFile);

        projectService.create(requestDTO, files);

        verify(fileStorageService, times(1)).upload(any(MultipartFile.class));

        // Verifica se o repository.save foi chamado exatamente UMA vez
        ArgumentCaptor<Project> projectCaptor = ArgumentCaptor.forClass(Project.class);
        verify(projectRepository, times(1)).save(projectCaptor.capture());

        Project savedProject = projectCaptor.getValue();
        assertThat(savedProject.getCoverImageUrl()).isEqualTo("http://minio/bucket/nova_img.jpg");
    }

    @Test
    @DisplayName("Deve atualizar projeto, deletar imagens órfãs e adicionar novas")
    void update_ShouldUpdateProjectAndManageImages() throws Exception {
        when(projectRepository.findById(10L)).thenReturn(Optional.of(project));
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(fileStorageService.upload(any(MultipartFile.class))).thenReturn("http://minio/bucket/nova_img.jpg");
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        List<MultipartFile> newFiles = List.of(mockFile);

        projectService.update(10L, requestDTO, newFiles);

        // A img2.jpg não estava no existingImageUrls do DTO, então deve ser deletada
        verify(fileStorageService, times(1)).delete("img2.jpg");

        // A nova imagem deve sofrer upload
        verify(fileStorageService, times(1)).upload(any(MultipartFile.class));

        // Verifica se os dados foram salvos corretamente
        ArgumentCaptor<Project> projectCaptor = ArgumentCaptor.forClass(Project.class);
        verify(projectRepository, times(1)).save(projectCaptor.capture());

        Project savedProject = projectCaptor.getValue();
        assertThat(savedProject.getTitle()).isEqualTo("Novo Título");
        assertThat(savedProject.getImageUrls()).contains("http://minio/bucket/img1.jpg", "http://minio/bucket/nova_img.jpg");
    }

    @Test
    @DisplayName("Deve deletar projeto e remover todas as suas imagens do storage")
    void delete_ShouldDeleteProjectAndRemoveImagesFromStorage() throws Exception {
        when(projectRepository.findById(10L)).thenReturn(Optional.of(project));

        projectService.delete(10L);

        // O projeto tinha 2 imagens no setup, ambas devem ser deletadas do MinIO
        verify(fileStorageService, times(1)).delete("img1.jpg");
        verify(fileStorageService, times(1)).delete("img2.jpg");

        verify(projectRepository, times(1)).delete(project);
    }

    @Test
    @DisplayName("Deve retornar lista de DTOs ao buscar por email do cliente")
    void findByClientEmail_ShouldReturnDtoList() {
        when(projectRepository.findByClient_Email("cliente@teste.com")).thenReturn(List.of(project));

        List<ProjectResponseDTO> result = projectService.findByClientEmail("cliente@teste.com");

        assertThat(result).hasSize(1);
        verify(projectRepository, times(1)).findByClient_Email("cliente@teste.com");
    }
}