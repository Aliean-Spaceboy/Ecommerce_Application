package com.ecomm.customer.response;

import com.ecomm.customer.dto.CustomerDto;

import lombok.Data;

@Data
public class AuthResponse {
	private CustomerDto customer;
	private String token;
}
