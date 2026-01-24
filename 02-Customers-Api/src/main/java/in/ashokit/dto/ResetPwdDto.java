package com.ecomm.customer.dto;

import lombok.Data;

@Data
public class ResetPwdDto {
	
	private String email;
	private String currentPassword;
	private String newPassword;
	private String confirmPassword;
	private String token;

}
