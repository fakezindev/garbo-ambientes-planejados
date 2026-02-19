package com.fakezindev.architecturestudio.repository;

import com.fakezindev.architecturestudio.model.entities.Lead;
import com.fakezindev.architecturestudio.model.enums.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByStatus(LeadStatus status);
}
