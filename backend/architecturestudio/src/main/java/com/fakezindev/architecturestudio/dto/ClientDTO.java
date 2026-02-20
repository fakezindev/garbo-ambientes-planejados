package com.fakezindev.architecturestudio.dto;

public record ClientDTO (
    String name,
    String email,
    String password,
    String phone,
    String address,
    String cpfCnpj
    ) {}
