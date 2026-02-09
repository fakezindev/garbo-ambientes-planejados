package com.fakezindev.architecturestudio.model.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "tb_project_images")
public class ProjectImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String imageUrl;
    private boolean isCover;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
}
