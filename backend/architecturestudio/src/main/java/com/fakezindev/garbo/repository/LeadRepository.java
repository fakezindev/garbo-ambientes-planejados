package com.fakezindev.garbo.repository;

import com.fakezindev.garbo.model.entities.Lead;
import com.fakezindev.garbo.model.enums.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByStatus(LeadStatus status);
}
