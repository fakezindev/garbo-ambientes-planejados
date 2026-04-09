package com.fakezindev.garbo.service;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.RemoveObjectArgs;
import io.minio.PutObjectArgs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class FileStorageService {

    private final String bucketName;
    private final MinioClient minioClient;
    private final String publicUrl; // 👇 CORREÇÃO 1: Criamos a variável da URL Pública

    // 👇 CORREÇÃO 2: Injetamos a URL do application.properties aqui no construtor
    public FileStorageService(MinioClient minioClient,
                              @Value("${application.bucket.name}") String bucketName,
                              @Value("${cloudflare.public.url}") String publicUrl) {
        this.minioClient = minioClient;
        this.bucketName = bucketName;
        this.publicUrl = publicUrl;
    }

    public String upload(MultipartFile file) {
        try {
            boolean bucketExiste = minioClient.bucketExists(
                    BucketExistsArgs.builder().bucket(bucketName).build()
            );

            if (!bucketExiste) {
                System.out.println(">>> AVISO: Bucket não existia! Recriando bucket '" + bucketName + "'...");
                minioClient.makeBucket(
                        MakeBucketArgs.builder().bucket(bucketName).build()
                );
            }

            // Gera o nome único
            String fileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename().replace(" ", "_");

            // Faz o upload da forma mais segura possível
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            // 👇 CORREÇÃO 3: A MÁGICA ACONTECE AQUI! Adeus localhost!
            // Retorna a URL pública do Cloudflare + o nome do arquivo.
            // (A URL pública do Cloudflare já aponta direto pro bucket, então não precisamos colocar o bucketName no caminho)
            return publicUrl + "/" + fileName;

        } catch (Exception e) {
            System.err.println(">>> ERRO FATAL NO MINIO: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao subir arquivo no MinIO", e);
        }
    }

    public void delete(String objectName) {
        try {
            System.out.println("MinIO: Tentando apagar objeto no bucket [" + bucketName + "]: " + objectName);

            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );

            System.out.println("MinIO: Objeto apagado com sucesso!");
        } catch (Exception e) {
            System.err.println("MinIO: ERRO ao deletar objeto antigo: " + e.getMessage());
            e.printStackTrace();
        }
    }
}