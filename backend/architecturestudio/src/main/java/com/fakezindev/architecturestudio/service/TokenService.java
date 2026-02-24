package com.fakezindev.architecturestudio.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fakezindev.architecturestudio.model.entities.Client;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Date;

@Service
public class TokenService {

    // Pegamos esse segredo do application.properties (vamos configurar já já)
    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(UserDetails user) {
        try {
            // Define o algoritmo de criptografia (HMAC256)
            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer("ArchitectureStudioAPI")
                    .withSubject(user.getUsername())
                    .withClaim("role", "ADMIN")
                    .withExpiresAt(genExpirationDate())
                    .sign(algorithm);
        } catch (Exception exception) {
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    public String generateClientToken(Client client) {
        try {
            // ⚠️ IMPORTANTE: Ajuste a variável 'secret' e 'Algorithm' para ficar
            // exatamente igual ao que você já usa no metodo do Admin!
            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer("ArchitectureStudioAPI") // Mantenha igual ao do Admin
                    .withSubject(client.getEmail()) // O crachá do cliente é o E-mail dele
                    .withClaim("id", client.getId()) // Guardamos o ID do cliente dentro do token!
                    .withClaim("role", "CLIENT") // Etiqueta de segurança: diz que ele é Cliente
                    .withExpiresAt(genExpirationDate()) // Pode usar a mesma função de validade (ex: 2 horas)
                    .sign(algorithm);

        } catch (com.auth0.jwt.exceptions.JWTCreationException exception){
            throw new RuntimeException("Erro ao gerar token do cliente: " + exception.getMessage());
        }
    }

    public String validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
            return Jwts.parserBuilder() // Se estiver na 0.11.5
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception exception) {
            return "";
        }
    }

    private Instant genExpirationDate() {
        // Dá uma validade de 2 horas para o token.
        // Se quiser que dure mais tempo, é só mudar o ".plusHours(2)"
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
