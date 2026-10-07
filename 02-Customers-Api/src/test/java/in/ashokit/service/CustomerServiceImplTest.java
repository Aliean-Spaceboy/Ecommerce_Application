package in.ashokit.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import in.ashokit.dto.CustomerDto;
import in.ashokit.dto.ResetPwdDto;
import in.ashokit.entities.CustomerEntity;
import in.ashokit.repository.CustomerRepository;
import in.ashokit.response.AuthResponse;
import in.ashokit.util.JwtUtil;

public class CustomerServiceImplTest {

    @Mock
    private CustomerRepository customerRepo;

    @Mock
    private BCryptPasswordEncoder pwdEncoder;

    @Mock
    private EmailService emailService;

    @Mock
    private AuthenticationManager authManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private CustomerServiceImpl customerService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testIsEmailUnique() {
        when(customerRepo.findByEmail("test@test.com")).thenReturn(null);
        assertTrue(customerService.isEmailUnique("test@test.com"));

        when(customerRepo.findByEmail("exist@test.com")).thenReturn(new CustomerEntity());
        assertFalse(customerService.isEmailUnique("exist@test.com"));
    }

    @Test
    public void testRegister_Success() {
        CustomerDto dto = new CustomerDto();
        dto.setName("John");
        dto.setEmail("john@test.com");

        CustomerEntity saved = new CustomerEntity();
        saved.setCustomerId(1);

        when(pwdEncoder.encode(anyString())).thenReturn("encodedPwd");
        when(customerRepo.save(any(CustomerEntity.class))).thenReturn(saved);
        when(emailService.sendEmail(anyString(), anyString(), anyString())).thenReturn(true);

        assertTrue(customerService.register(dto));
        verify(customerRepo, times(1)).save(any(CustomerEntity.class));
        verify(emailService, times(1)).sendEmail(anyString(), anyString(), anyString());
    }

    @Test
    public void testGetCustomerByEmail() {
        CustomerEntity entity = new CustomerEntity();
        entity.setEmail("john@test.com");
        
        when(customerRepo.findByEmail("john@test.com")).thenReturn(entity);
        
        CustomerDto result = customerService.getCustomerByEmail("john@test.com");
        assertNotNull(result);
        assertEquals("john@test.com", result.getEmail());
    }

    @Test
    public void testLogin_Success() {
        CustomerDto dto = new CustomerDto();
        dto.setEmail("john@test.com");
        dto.setPassword("pwd");

        Authentication auth = mock(Authentication.class);
        when(auth.isAuthenticated()).thenReturn(true);
        when(authManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);

        CustomerEntity entity = new CustomerEntity();
        entity.setEmail("john@test.com");
        when(customerRepo.findByEmail("john@test.com")).thenReturn(entity);
        when(jwtUtil.generateToken("john@test.com")).thenReturn("dummy-jwt-token");

        AuthResponse response = customerService.login(dto);
        assertNotNull(response);
        assertEquals("dummy-jwt-token", response.getToken());
    }
    
    @Test
    public void testLogin_Failure() {
        CustomerDto dto = new CustomerDto();
        dto.setEmail("john@test.com");
        dto.setPassword("wrong");

        when(authManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenThrow(new org.springframework.security.core.AuthenticationException("Failed"){});

        AuthResponse response = customerService.login(dto);
        assertNull(response);
    }
}
