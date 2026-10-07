package in.ashokit.repo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import in.ashokit.Entity.CustomerEntity;
import in.ashokit.Entity.OrderEntity;

@DataJpaTest
@ActiveProfiles("test")
public class NotificationOrderRepoIntegrationTest {

    @Autowired
    private OrderRepo orderRepo;
    
    @Autowired
    private CustomerRepo customerRepo;

    @Test
    public void testSaveAndFindByRazorPayOrderId() {
        CustomerEntity customer = new CustomerEntity();
        customer.setCustomerName("Bob");
        customer.setEmail("bob@test.com");
        customer = customerRepo.save(customer);

        OrderEntity order = new OrderEntity();
        order.setRazorPayOrderId("razorpay_999");
        order.setOrderStatus("CONFIRMED");
        order.setEmail("bob@test.com");
        order.setCustomerEntity(customer);
        order.setTotalPrice(100.0);
        order.setTotalQuentity(1);
        orderRepo.save(order);

        OrderEntity foundOrder = orderRepo.findByRazorPayOrderId("razorpay_999");
        
        assertNotNull(foundOrder);
        assertEquals("CONFIRMED", foundOrder.getOrderStatus());
    }
}
