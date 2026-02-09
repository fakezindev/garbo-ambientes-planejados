package com.fakezindev.architecturestudio.model.entities;

import com.fakezindev.architecturestudio.model.enums.LeadStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "tb_leads")
public class Lead {

    @Id
    private Long id;

    private String name;
    private String email;
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    private LeadStatus status = LeadStatus.NOVO;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
