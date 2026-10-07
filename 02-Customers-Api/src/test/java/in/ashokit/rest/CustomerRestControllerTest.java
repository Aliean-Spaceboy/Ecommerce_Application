package in.ashokit.rest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import in.ashokit.dto.CustomerDto;
import in.ashokit.dto.ResetPwdDto;
import in.ashokit.response.ApiResponse;
import in.ashokit.response.AuthResponse;
import in.ashokit.service.CustomerService;

public class CustomerRestControllerTest {

    private CustomerRestController customerRestController;
    private CustomerService customerService;
    private BCryptPasswordEncoder pwdEncoder;

    @BeforeEach
    public void setup() {
        customerRestController = new CustomerRestController();
        customerService = mock(CustomerService.class);
        pwdEncoder = mock(BCryptPasswordEncoder.class);
        ReflectionTestUtils.setField(customerRestController, "customerService", customerService);
        ReflectionTestUtils.setField(customerRestController, "pwdEncoder", pwdEncoder);
    }

    @Test
    public void testRegister_DuplicateEmail() {
        CustomerDto dto = new CustomerDto();
        dto.setEmail("test@test.com");
        when(customerService.isEmailUnique("test@test.com")).thenReturn(false);

        ResponseEntity<ApiResponse<String>> response = customerRestController.register(dto);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(400, response.getBody().getStatus());
    }

    @Test
    public void testRegister_Success() {
        CustomerDto dto = new CustomerDto();
        dto.setEmail("test@test.com");
        when(customerService.isEmailUnique("test@test.com")).thenReturn(true);
        when(customerService.register(dto)).thenReturn(true);

        ResponseEntity<ApiResponse<String>> response = customerRestController.register(dto);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(201, response.getBody().getStatus());
    }

    @Test
    public void testLogin_Success() {
        CustomerDto dto = new CustomerDto();
        AuthResponse authResp = new AuthResponse();
        when(customerService.login(dto)).thenReturn(authResp);

        ResponseEntity<ApiResponse<AuthResponse>> response = customerRestController.login(dto);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(200, response.getBody().getStatus());
    }

    @Test
    public void testLogin_InvalidCredentials() {
        CustomerDto dto = new CustomerDto();
        when(customerService.login(dto)).thenReturn(null);

        ResponseEntity<ApiResponse<AuthResponse>> response = customerRestController.login(dto);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(500, response.getBody().getStatus()); // weird design but correct for code
    }

    @Test
    public void testForgetPassword_Success() {
        when(customerService.forgetPassword("test@test.com")).thenReturn(true);

        ResponseEntity<ApiResponse<String>> response = customerRestController.forgetPassword("test@test.com");
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(200, response.getBody().getStatus());
    }
}
