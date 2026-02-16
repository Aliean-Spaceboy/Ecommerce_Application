package in.ashokit.service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import in.ashokit.dto.CustomerDto;
import in.ashokit.dto.ResetPwdDto;
import in.ashokit.entities.CustomerEntity;
import in.ashokit.mapper.CustomerMapper;
import in.ashokit.repository.CustomerRepository;
import in.ashokit.response.AuthResponse;

@Service
public class CustomerServiceImpl implements CustomerService {

	@Autowired
	private CustomerRepository customerRepo;
	@Autowired
	private BCryptPasswordEncoder pwdEncoder;
	@Autowired
	private EmailService emailService;
	@Autowired
	private AuthenticationManager authManager;

//========================Checking for unique email given by customer===========================================
	@Override
	public Boolean isEmailUnique(String email) {

		CustomerEntity byEmail = customerRepo.findByEmail(email);

		return byEmail == null;
	}

//==============================================Registering the Customer=========================================
	@Override
	public Boolean register(CustomerDto customerDto) {

		// getting random pwd and encoding it
		String originalPwd = generateRandomPassword();
		String encodedPwd = pwdEncoder.encode(originalPwd);

		// setting pwd and updatedPwd as NO
		CustomerEntity customerEntity = CustomerMapper.convertToEntity(customerDto);
		customerEntity.setPassword(encodedPwd);
		customerEntity.setPasswordUpdated("NO");

		// saving the record into database
		CustomerEntity savedEntity = customerRepo.save(customerEntity);

		// checking if the customer was successfully saved or not

		if (savedEntity.getCustomerId() != null) {
			String subject = "🎉 Registration Successful - Welcome to Our Platform!";

			String body = String.format(
					"""
							<html>
							<head>
							    <style>
							        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
							        .email-container { max-width: 600px; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); margin: auto; }
							        .header { text-align: center; font-size: 20px; font-weight: bold; color: #333; }
							        .content { padding: 10px; font-size: 16px; color: #555; }
							        .password-box { background: #f8f8f8; padding: 15px; border-radius: 5px; font-size: 18px; font-weight: bold; text-align: center; color: #007BFF; }
							        .footer { margin-top: 20px; text-align: center; font-size: 14px; color: #777; }
							        .social-icons a { margin: 0 10px; text-decoration: none; }
							        .social-icons img { width: 30px; }
							    </style>
							</head>
							<body>
							    <div class='email-container'>
							        <div class='header'>Welcome to Our Platform! 🎊</div>
							        <div class='content'>
							            <p>Dear %s,</p>
							            <p>Thank you for registering! Here is your login password:</p>
							            <div class='password-box'>%s</div>
							            <p>Please change your password after logging in for security reasons.</p>
							        </div>
							        <hr style='margin: 20px 0;'>
							        <p style='text-align: center;'>Need Help? Contact Us:</p>
							        <div class='social-icons' style='text-align: center;'>
							            <a href='tel:+919519824625'>📞</a>
							            <a href='mailto:farhansiddiquii438@gmail.com'>📧</a>
							            <a href='https://www.linkedin.com/in/farhan15/'>
							                <img src='https://cdn-icons-png.flaticon.com/512/174/174857.png'>
							            </a>
							            <a href='https://github.com/farhan1599'>
							                <img src='https://cdn-icons-png.flaticon.com/512/25/25231.png'>
							            </a>
							            <a href='#'>
							                <img src='https://cdn-icons-png.flaticon.com/512/174/174855.png'>
							            </a>
							        </div>
							        <p style='text-align: center; font-size: 12px; color: #666;'>&copy; 2025 Farhan Siddiqui | All Rights Reserved</p>
							    </div>
							</body>
							</html>
							""",
					customerDto.getName(), originalPwd);

			return emailService.sendEmail(customerDto.getEmail(), subject, body);
		}

		return false;
	}

//===================================== reset pwd=============================
	@Override
	public Boolean resetPassword(ResetPwdDto resetPwdDto) {
		CustomerEntity customerEntity = customerRepo.findByEmail(resetPwdDto.getEmail());

//getting the new pwd and encoding that and setting new pwd and pwdUpdated as YES
		if (customerEntity != null) {
			String encodedNewPwd = pwdEncoder.encode(resetPwdDto.getNewPassword());
			customerEntity.setPassword(encodedNewPwd);
			customerEntity.setPasswordUpdated("YES");

			customerRepo.save(customerEntity);
			return true;
		}

		return false;
	}

	// ==========================================getting customer by email===============================
	@Override
	public CustomerDto getCustomerByEmail(String email) {

		CustomerEntity customerEntity = customerRepo.findByEmail(email);

		if (customerEntity != null) {
			return CustomerMapper.convertToDto(customerEntity);
		}
		return null;
	}

	// =================================================login===================================================
	@Override
	public AuthResponse login(CustomerDto customerDto) {
		AuthResponse authResponse = null;

		UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(customerDto.getEmail(),
				customerDto.getPassword());

		Authentication authenticate = authManager.authenticate(authToken);

		if (authenticate.isAuthenticated()) {
			authResponse = new AuthResponse();
			CustomerEntity customerEntity = customerRepo.findByEmail(customerDto.getEmail());
			authResponse.setCustomer(CustomerMapper.convertToDto(customerEntity));
			authResponse.setToken("");

		}
		return authResponse;
	}
//=============================================forget password==================================================
	@Override
	public Boolean forgetPassword(String email) {
		CustomerEntity customerEntity = customerRepo.findByEmail(email);
		if (customerEntity != null) {

			// 1. Generate a random secure token
			String token = UUID.randomUUID().toString();

			// 2. Save token and expiry (15 minutes) in customer entity
			customerEntity.setResetToken(token);
			customerEntity.setTokenExpiry(LocalDateTime.now().plusMinutes(15));
			customerRepo.save(customerEntity);

			// 3. Create the reset link
			String resetLink = "http://localhost:8081/reset-password-form?token=" + token + "&email=" + email;

			// 4. Create the email body with the reset link
			String subject = "Password Reset Request";
			String body = "<html>" + "<body style=\"font-family: Arial, sans-serif; padding: 20px;\">"
					+ "    <div style=\"max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;\">"
					+ "        <h2 style=\"color: #333; text-align: center;\">Password Reset Request</h2>"
					+ "        <p>Dear User,</p>"
					+ "        <p>We received a request to reset your password. Please click the link below to reset your password. The link is valid for 15 minutes:</p>"
					+ "        <div style=\"text-align: center; margin: 20px;\">" + " <a href=\"" + resetLink
					+ "\" style=\"background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;\">Reset Password</a>"
					+ "        </div>"
					+ "        <p>If you did not request this, please ignore this email or contact support.</p>"
					+ "        <hr style=\"margin: 20px 0;\">"
					+ "        <p style=\"text-align: center;\">Connect with us:</p>"
					+ "        <div style=\"text-align: center;\">"
					+ "            <a href=\"https://www.linkedin.com/in/farhan15/\" style=\"margin: 0 10px;\">"
					+ "                <img src=\"https://cdn-icons-png.flaticon.com/512/174/174857.png\" width=\"30\">"
					+ "            </a>"
					+ "            <a href=\"https://github.com/farhan1599\" style=\"margin: 0 10px;\">"
					+ "                <img src=\"https://cdn-icons-png.flaticon.com/512/25/25231.png\" width=\"30\">"
					+ "            </a>" + "            <a href=\"#\" style=\"margin: 0 10px;\">"
					+ "                <img src=\"https://cdn-icons-png.flaticon.com/512/174/174855.png\" width=\"30\">"
					+ "            </a>" + "        </div>"
					+ "        <p style=\"text-align: center; font-size: 12px; color: #666;\">&copy; 2025 Farhan Siddiqui | All Rights Reserved</p>"
					+ "    </div>" + "</body>" + "</html>";

			emailService.sendEmail(email, subject, body);
			return true;
		}
		return false;
	}
	
	
	
//=================================================reset password via link(email)==============================================
	
	@Override
	public Boolean resetPasswordViaLink(ResetPwdDto resetPwdDto) {
	    CustomerEntity customer = customerRepo.findByEmail(resetPwdDto.getEmail());

	    if (customer == null || customer.getResetToken() == null ||
	        !customer.getResetToken().equals(resetPwdDto.getToken()) ||
	        customer.getTokenExpiry().isBefore(LocalDateTime.now())) {
	        return false;
	    }

	    if (!resetPwdDto.getNewPassword().equals(resetPwdDto.getConfirmPassword())) {
	        return false;
	    }

	    customer.setPassword(pwdEncoder.encode(resetPwdDto.getNewPassword()));
	    customer.setPasswordUpdated("YES");
	    customer.setResetToken(null);
	    customer.setTokenExpiry(null);
	    customerRepo.save(customer);

	    return true;
	}


//============================================generating random password======================================
	private String generateRandomPassword() {
		String SALTCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";

		StringBuilder password = new StringBuilder();

		Random random = new Random();

		for (int i = 1; i <= 6; i++) {
			int index = (int) (random.nextFloat() * SALTCHARS.length());
			password.append(SALTCHARS.charAt(index));
		}

		String randomPwd = password.toString();

		return randomPwd;
	}

}
