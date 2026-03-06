package com.fakezindev.garbo.dto;

public record ClientRegisterDTO(
        String name,
        String email,
        String password,
        String phone,
        String cpf
) {}
