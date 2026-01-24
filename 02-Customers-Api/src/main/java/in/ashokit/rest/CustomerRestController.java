package com.ecomm.customer.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ecomm.customer.dto.CustomerDto;
import com.ecomm.customer.dto.ResetPwdDto;
import com.ecomm.customer.response.ApiResponse;
import com.ecomm.customer.response.AuthResponse;
import com.ecomm.customer.service.CustomerService;

@RestController
public class CustomerRestController {

	
	
	@Autowired
	private CustomerService customerService;

	@Autowired
	private BCryptPasswordEncoder pwdEncoder;

//==========================registering the Customer================================================

	@PostMapping(value = "/register", produces = "application/json")
	public ResponseEntity<ApiResponse<String>> register(@RequestBody CustomerDto customerDto) {

		ApiResponse<String> response = new ApiResponse<>();

		Boolean isUnique = customerService.isEmailUnique(customerDto.getEmail());

		// if email is not unique
		if (!isUnique) {
			response.setStatus(400);
			response.setMessage("Error");
			response.setData("Duplicate Email Found..!");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		// if email is unique
		Boolean register = customerService.register(customerDto);

		if (register) {
			response.setStatus(201);
			response.setMessage("Success");
			response.setData("Registered Successfully.");
			return new ResponseEntity<>(response, HttpStatus.CREATED);
		} else {
			response.setStatus(500);
			response.setMessage("Error");
			response.setData("Registered Failed..!");
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

//===============================login=====================================================

	@PostMapping(value = "/login", produces = "application/json")
	public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody CustomerDto customerDto) {

		ApiResponse<AuthResponse> response = new ApiResponse<>();

		AuthResponse authResp = customerService.login(customerDto);

		if (authResp != null) {
			response.setStatus(200);
			response.setMessage("Login Success.");
			response.setData(authResp);
			return new ResponseEntity<ApiResponse<AuthResponse>>(response, HttpStatus.OK);
		} else {
			response.setStatus(500);
			response.setMessage("Invalid Credentials..!");
			response.setData(null);
			return new ResponseEntity<ApiResponse<AuthResponse>>(response, HttpStatus.BAD_REQUEST);
		}
	}

//=====================================reset pwd===================================================

	@PostMapping(value = "/reset-pwd", produces = "application/json")
	public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody ResetPwdDto resetPwdDto) {

		ApiResponse<String> response = new ApiResponse<>();

		// getting customer by email
		CustomerDto customerDto = customerService.getCustomerByEmail(resetPwdDto.getEmail());

		// Check if customer exists
		if (customerDto == null) {
			response.setStatus(404);
			response.setMessage("Failed..");
			response.setData("Customer Not Found..!");
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}

		// if encoded pwd is not matching with given pwd
		if (!pwdEncoder.matches(resetPwdDto.getCurrentPassword(), customerDto.getPassword())) {
			response.setStatus(400);
			response.setMessage("Failed");
			response.setData("Current Password is Incorrect..!");
			return new ResponseEntity<ApiResponse<String>>(response, HttpStatus.BAD_REQUEST);
		}

		// Check if new password and confirm password match
		if (!resetPwdDto.getNewPassword().equals(resetPwdDto.getConfirmPassword())) {
			response.setStatus(400);
			response.setMessage("Failed..!");
			response.setData("New Password and Confirm Password is not Matching..!");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		// reseting the pwd
		Boolean isReset = customerService.resetPassword(resetPwdDto);
		if (isReset) {
			response.setStatus(200);
			response.setMessage("Success.");
			response.setData("Password Updated Successfully.");
			return new ResponseEntity<ApiResponse<String>>(response, HttpStatus.OK);
		} else {
			response.setStatus(500);
			response.setMessage("Failed..!");
			response.setData("Password Reset Failed..!");
			return new ResponseEntity<ApiResponse<String>>(response, HttpStatus.BAD_REQUEST);
		}
	}
	
	
//=======================reset via link=============================
	@PostMapping("/reset-password-via-link")
	public ResponseEntity<ApiResponse<String>> resetPwdViaLink(@RequestBody ResetPwdDto resetPwdDto) {
	    ApiResponse<String> response = new ApiResponse<>();

	    boolean isReset = customerService.resetPasswordViaLink(resetPwdDto);

	    if (isReset) {
	        response.setStatus(200);
	        response.setMessage("Success");
	        response.setData("Password Reset Successful.");
	        return new ResponseEntity<>(response, HttpStatus.OK);
	    } else {
	        response.setStatus(400);
	        response.setMessage("Failed..!");
	        response.setData("Invalid or Expired Token..!");
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }
	}

//================================forgot password=============================================

	@GetMapping(value = "/forget-pwd/{email}", produces = "application/json")
	public ResponseEntity<ApiResponse<String>> forgetPassword(@PathVariable String email) {

		ApiResponse<String> response = new ApiResponse<>();

		// checking record with the given email
		Boolean status = customerService.forgetPassword(email);
		// if present
		if (status) {
			response.setStatus(200);
			response.setMessage("Success");
			response.setData("Email Sent to Reset Password.");
			return new ResponseEntity<ApiResponse<String>>(response, HttpStatus.OK);
		} else {
			response.setStatus(400);
			response.setMessage("Failed..!");
			response.setData("No Account Found..!");
			return new ResponseEntity<ApiResponse<String>>(response, HttpStatus.BAD_REQUEST);

		}

	}

}
