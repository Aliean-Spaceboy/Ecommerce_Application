package in.ashokit.service;



import in.ashokit.dto.CustomerDto;
import in.ashokit.dto.ResetPwdDto;
import in.ashokit.response.AuthResponse;

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
