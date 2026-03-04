package com.fakezindev.garbo.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.*;

public record LeadRequestDTO(

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        Long id,

        @NotBlank(message = "O nome não pode estar em branco")
        @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres")
        String name,

        @NotBlank(message = "O email é obrigatório")
        @Email(message = "Por favor, insira um e-mail válido.")
        String email,

        @NotBlank(message = "O telefone é obrigatório.")
        @Pattern(regexp = "^\\(?[1-9]{2}\\)? ?(?:[2-8]|9[1-9])[0-9]{3}\\-?[0-9]{4}$")
        String phone,

        @NotNull(message = "Escolha uma das opções")
        String service,

        @NotBlank(message = "O ambiente não pode estar vazio.")
        @Size(min = 3, max = 1000, message = "A mensagem deve ter entre 3 e 1000 caracteres.")
        String environment

) {}