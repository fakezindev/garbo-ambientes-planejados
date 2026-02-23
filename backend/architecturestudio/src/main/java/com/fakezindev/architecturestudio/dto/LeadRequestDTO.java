package com.fakezindev.architecturestudio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// Não precisa de @Data, @NoArgsConstructor ou @AllArgsConstructor
public record LeadRequestDTO(

        @NotBlank(message = "O nome não pode estar em branco")
        @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres")
        String name,

        @NotBlank(message = "O email é obrigatório")
        @Email(message = "Por favor, insira um e-mail válido.")
        String email,

        @NotBlank(message = "O telefone é obrigatório.")
        @Pattern(regexp = "^\\(?[1-9]{2}\\)? ?(?:[2-8]|9[1-9])[0-9]{3}\\-?[0-9]{4}$")
        String phone,

        @NotBlank(message = "O ambiente não pode estar vazio.")
        @Size(min = 3, max = 1000, message = "A mensagem deve ter entre 3 e 1000 caracteres.")
        String environment

) {}