package in.ashokit.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import in.ashokit.Entity.CustomerEntity;
import in.ashokit.Entity.OrderEntity;
import in.ashokit.repo.OrderRepo;

public class NotificationServiceImplTest {

    @Mock
    private EmailService emailService;

    @Mock
    private OrderRepo orderRepo;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSendNotification() {
        OrderEntity order = new OrderEntity();
        order.setOrderTrackingNum("TRACK999");

        CustomerEntity customer = new CustomerEntity();
        customer.setEmail("test@test.com");
        order.setCustomerEntity(customer);

        when(orderRepo.findByDeleveryDate(LocalDate.now())).thenReturn(Collections.singletonList(order));
        when(emailService.sendEmail(anyString(), anyString(), anyString())).thenReturn(true);

        Integer count = notificationService.sendNotfication();

        assertEquals(1, count);
        verify(emailService, times(1)).sendEmail(anyString(), anyString(), anyString());
    }
}
