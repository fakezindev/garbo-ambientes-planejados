package com.fakezindev.garbo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ping")
public class PingController {

    @GetMapping
    public ResponseEntity<String> ping() {
        // Retorna um simples 200 OK com uma mensagem de texto puro
        return ResponseEntity.ok("pong");
    }
}