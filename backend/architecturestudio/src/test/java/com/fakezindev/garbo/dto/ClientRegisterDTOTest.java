package com.fakezindev.garbo.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ClientRegisterDTOTest {

    private Validator validator;

    // Prepara o "juiz" das validações antes de cada teste
    @BeforeEach
    void setUp() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void deveDetectarErro_QuandoCpfEPhoneForemInvalidos() {
        // 1. DADOS FALSOS (O ataque do Hacker)
        ClientRegisterDTO dtoInvalido = new ClientRegisterDTO(
                "Teste",
                "teste@garbo.com",
                "senha123",
                "(11) 11111-1111", // Telefone zoado
                "111.111.111-11"   // CPF da lista negra
        );

        // 2. AÇÃO: Pedimos para o Java analisar o DTO
        var violacoes = validator.validate(dtoInvalido);

        // 3. VERIFICAÇÃO: Se a lista de violações NÃO está vazia, o bloqueio funcionou!
        assertFalse(violacoes.isEmpty(), "O Java deveria ter bloqueado esse DTO, mas deixou passar!");
    }

    @Test
    void devePassarSemErros_QuandoDadosForemValidos() {
        // 1. DADOS CORRETOS
        ClientRegisterDTO dtoValido = new ClientRegisterDTO(
                "Bruno",
                "bruno@garbo.com",
                "senha123",
                "(11) 98765-4321",
                "52998224725" // Um CPF válido gerado na internet
        );

        // 2. AÇÃO
        var violacoes = validator.validate(dtoValido);

        // 3. VERIFICAÇÃO: A lista de erros deve estar perfeitamente vazia
        assertTrue(violacoes.isEmpty(), "O Java bloqueou um dado que estava correto!");
    }
}