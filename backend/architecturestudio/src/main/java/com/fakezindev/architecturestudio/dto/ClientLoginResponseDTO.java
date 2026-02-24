package com.fakezindev.architecturestudio.dto;

public record ClientLoginResponseDTO(String token, ClientInfo client) {
    // Um mini-record interno só para mandar os dados básicos do cliente pro React
    public record ClientInfo(Long id, String name, String email) {}
}