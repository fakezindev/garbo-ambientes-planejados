package com.fakezindev.garbo.repository;

import com.fakezindev.garbo.model.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByClient_Email(String email);
}
