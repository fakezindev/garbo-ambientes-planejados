package com.fakezindev.garbo.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ValidationExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {

        // 1. Vasculha o erro feio do Java, pega apenas as suas mensagens bonitas do DTO e junta tudo
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(" | "));

        // 2. Cria a estrutura exata de JSON que o Toast do seu React está esperando ler
        Map<String, String> response = new HashMap<>();
        response.put("message", errorMessage);

        // 3. Devolve um Erro 400 (Bad Request) limpinho e direto ao ponto
        return ResponseEntity.badRequest().body(response);
    }
}