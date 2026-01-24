package com.ecomm.customer.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecomm.customer.entities.CustomerEntity;

public interface CustomerRepository extends JpaRepository<CustomerEntity, Integer> {
	public CustomerEntity findByEmail(String email);
}
