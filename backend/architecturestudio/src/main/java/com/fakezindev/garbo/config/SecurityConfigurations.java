package com.fakezindev.garbo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    private final SecurityFilter securityFilter;

    public SecurityConfigurations(SecurityFilter securityFilter) {
        this.securityFilter = securityFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/client/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/client/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/projects").permitAll() // Clientes podem ver o portfólio
                        .requestMatchers(HttpMethod.GET, "/projects/*").permitAll()
                        .requestMatchers(HttpMethod.POST, "/leads").permitAll()

                        // BLOQUEADO (Só Admin com Token)
                        .requestMatchers(HttpMethod.POST, "/projects").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/projects/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/projects/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/leads").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/clients").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/clients/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/clients/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/transactions").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/transactions").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/transactions/**").hasRole("ADMIN")

                        // Qualquer outra coisa precisa estar logado
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Criptografia forte para senhas
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 1. Quem pode acessar? O seu React!
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));

        // 2. Quais métodos são permitidos? Tudo!
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 3. Quais cabeçalhos? Todos (incluindo o nosso Authorization com o Token)
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        // 4. Aplica essa regra para TODAS as rotas (/**)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
