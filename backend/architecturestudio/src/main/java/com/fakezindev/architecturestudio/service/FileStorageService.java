package com.fakezindev.architecturestudio.service;

import io.awspring.cloud.s3.S3Template;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Service
public class FileStorageService {

    private final S3Template s3Template;
    private final String bucketName;

    // O Spring injeta o bucketName direto do application.properties
    public FileStorageService(S3Template s3Template,
                              @Value("${application.bucket.name}") String bucketName) {
        this.s3Template = s3Template;
        this.bucketName = bucketName;
    }

    public String upload(MultipartFile file) {
        // 1. Gerar nome único para não sobrescrever arquivos (ex: a1b2c3-sala.jpg)
        String originalName = file.getOriginalFilename();
        String extension = originalName != null && originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf("."))
                : "";
        String fileName = UUID.randomUUID().toString() + extension;

        try {
            // 2. Enviar para o MinIO
            InputStream inputStream = file.getInputStream();
            s3Template.upload(bucketName, fileName, inputStream);

            // 3. Retornar a URL de acesso
            // Nota: Como é local (Docker), montamos a URL na mão.
            // Em produção (AWS real), usaríamos s3Template.getSignedUrl() ou CloudFront.
            return "http://localhost:9000/" + bucketName + "/" + fileName;
        }
        catch (IOException e) {
            throw new RuntimeException("Error uploading file: " + originalName, e);
        }
    }

    public void delete(String objectName) {
        try {
            System.out.println("S3: Tentando apagar objeto no bucket [" + bucketName + "]: " + objectName);
            s3Template.deleteObject(bucketName, objectName);
            System.out.println("S3: Comando de delete enviado com sucesso!");
        } catch (Exception e) {
            System.err.println("S3: ERRO CRÍTICO ao deletar: " + e.getMessage());
            e.printStackTrace(); // Mostra o erro completo no terminal
        }
    }
}
