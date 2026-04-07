package com.fakezindev.garbo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.br.CPF;

public record ClientRegisterDTO(
        @NotBlank(message = "O nome é obrigatório")
        String name,
        String email,
        String password,
        @NotBlank(message = "O telefone é obrigatório")
        @Pattern(regexp = "^\\([1-9]{2}\\) (?:[2-8]|9[1-9])[0-9]{3}\\-[0-9]{4}$", message = "Telefone inválido. Use o formato (XX) 9XXXX-XXXX")
        String phone,
        @NotBlank(message = "O CPF é obrigatório")
        @CPF(message = "CPF com formato ou dígito verificador inválido")
        String cpf
) {}
