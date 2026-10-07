package in.ashokit;

import com.fasterxml.jackson.databind.ObjectMapper;
import in.ashokit.dto.CustomerDto;
import in.ashokit.entities.CustomerEntity;
import in.ashokit.repository.CustomerRepository;
import in.ashokit.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class CustomerApiApplicationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @MockBean
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        customerRepository.deleteAll();
        doReturn(true).when(emailService).sendEmail(any(String.class), any(String.class), any(String.class));
    }

    @Test
    void testRegisterNewCustomer() throws Exception {
        CustomerDto dto = new CustomerDto();
        dto.setName("John Doe");
        dto.setEmail("john.doe@example.com");
        dto.setPhno(1234567890L);

        mockMvc.perform(post("/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value(201))
                .andExpect(jsonPath("$.message").value("Success"));
    }

    @Test
    void testRegisterDuplicateEmail() throws Exception {
        CustomerEntity customer = new CustomerEntity();
        customer.setName("John Doe");
        customer.setEmail("duplicate@example.com");
        customer.setPassword("encodedPwd");
        customerRepository.save(customer);

        CustomerDto dto = new CustomerDto();
        dto.setName("Jane Doe");
        dto.setEmail("duplicate@example.com");
        dto.setPhno(9876543210L);

        mockMvc.perform(post("/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.data").value("Duplicate Email Found..!"));
    }

    @Test
    void testLoginSuccess() throws Exception {
        CustomerEntity customer = new CustomerEntity();
        customer.setName("John Doe");
        customer.setEmail("login@example.com");
        customer.setPassword(bCryptPasswordEncoder.encode("password123"));
        customer.setPasswordUpdated("YES");
        customerRepository.save(customer);

        CustomerDto dto = new CustomerDto();
        dto.setEmail("login@example.com");
        dto.setPassword("password123");

        mockMvc.perform(post("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.customer.email").value("login@example.com"))
                .andExpect(jsonPath("$.data.token").exists());
    }
}
