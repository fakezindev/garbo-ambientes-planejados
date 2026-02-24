package com.fakezindev.architecturestudio.dto;

public record ClientRegisterDTO(
        String name,
        String email,
        String password,
        String phone,
        String cpfCnpj
) {}
