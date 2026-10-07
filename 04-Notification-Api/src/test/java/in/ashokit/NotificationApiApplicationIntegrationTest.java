package in.ashokit;

import in.ashokit.Entity.CustomerEntity;
import in.ashokit.Entity.OrderEntity;
import in.ashokit.repo.CustomerRepo;
import in.ashokit.repo.OrderRepo;
import in.ashokit.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class NotificationApiApplicationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private CustomerRepo customerRepo;

    @MockBean
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        orderRepo.deleteAll();
        customerRepo.deleteAll();

        doReturn(true).when(emailService).sendEmail(any(String.class), any(String.class), any(String.class));
    }

    @Test
    void testDemoSendNotification() throws Exception {
        CustomerEntity customer = new CustomerEntity();
        customer.setCustomerName("Alice");
        customer.setEmail("alice@example.com");
        customer.setCustomerPhno(1234567890L);
        customerRepo.save(customer);

        OrderEntity order = new OrderEntity();
        order.setOrderTrackingNum(UUID.randomUUID().toString());
        order.setCustomerEntity(customer);
        order.setEmail(customer.getEmail());
        order.setDeleveryDate(LocalDate.now());
        order.setTotalQuentity(1);
        order.setTotalPrice(50.0);
        orderRepo.save(order);

        mockMvc.perform(get("/demo"))
                .andExpect(status().isOk())
                .andExpect(content().string("Success"));

        verify(emailService, times(1)).sendEmail(any(String.class), any(String.class), any(String.class));
    }
}
