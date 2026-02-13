package com.fakezindev.architecturestudio.model.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tb_clients")
@Data
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    private String address;
    private String cpfCnpj;
}
