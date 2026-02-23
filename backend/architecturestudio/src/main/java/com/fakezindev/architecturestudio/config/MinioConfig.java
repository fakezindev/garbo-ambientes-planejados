package com.fakezindev.architecturestudio.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

    // Pegamos as mesmas credenciais que você já usa no application.properties
    // Se ele não achar a variável, ele usa o padrão do MinIO (localhost, minioadmin)
    @Value("${spring.cloud.aws.s3.endpoint:http://localhost:9000}")
    private String endpoint;

    @Value("${spring.cloud.aws.credentials.access-key:minioadmin}")
    private String accessKey;

    @Value("${spring.cloud.aws.credentials.secret-key:minioadmin}")
    private String secretKey;

    // 👇 A MÁGICA ESTÁ AQUI: Ensinamos o Spring a criar o MinioClient!
    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
    }
}