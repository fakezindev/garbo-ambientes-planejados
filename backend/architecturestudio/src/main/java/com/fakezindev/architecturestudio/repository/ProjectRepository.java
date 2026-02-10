package com.fakezindev.architecturestudio.repository;

import com.fakezindev.architecturestudio.model.entities.Project;
import com.fakezindev.architecturestudio.model.enums.ProjectCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCategory(ProjectCategory category);
}
