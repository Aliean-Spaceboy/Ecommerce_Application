package com.ecomm.customer.service;

import com.ecomm.customer.dto.CustomerDto;
import com.ecomm.customer.dto.ResetPwdDto;
import com.ecomm.customer.response.AuthResponse;

public interface CustomerService {

	// to register the Customer
	public Boolean register(CustomerDto customerDto);

	// to check duplicate email
	public Boolean isEmailUnique(String email);

	// for reset password
	public Boolean resetPassword(ResetPwdDto resetPwdDto);
	
	//reset pwd via link
	public Boolean resetPasswordViaLink(ResetPwdDto resetPwdDto);

	// to get Customer by customer email
	public CustomerDto getCustomerByEmail(String email);

	// for forget password
	public Boolean forgetPassword(String email);

	// for login(in AuthResponse we'll send Customer details and JWT token back to
	// the client)
	public AuthResponse login(CustomerDto customerDto);
}
