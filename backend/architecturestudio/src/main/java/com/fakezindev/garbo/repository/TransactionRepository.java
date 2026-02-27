package com.fakezindev.garbo.repository;

import com.fakezindev.garbo.model.entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}
