package com.fakezindev.garbo.config;

import com.fakezindev.garbo.repository.ClientRepository;
import com.fakezindev.garbo.repository.UserRepository;
import com.fakezindev.garbo.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;

    public SecurityFilter(TokenService tokenService, UserRepository userRepository,  ClientRepository clientRepository) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        var token = this.recoverToken(request);
        if (token != null) {
            var subject = tokenService.validateToken(token); // Aqui ele pega o e-mail de dentro do token

            // 1. TENTA ACHAR O ADMIN
            UserDetails user = userRepository.findByUsername(subject).orElse(null);

            // 2. SE NÃO ACHAR, TENTA ACHAR O CLIENTE
            if (user == null) {
                user = clientRepository.findByEmail(subject).orElse(null);
            }

            // 3. SE ACHOU ALGUÉM, LIBERA O ACESSO
            if (user != null) {
                var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        // O token vem como "Bearer eyJhbGciOi..." -> removemos o "Bearer "
        return authHeader.replace("Bearer ", "");
    }
}
