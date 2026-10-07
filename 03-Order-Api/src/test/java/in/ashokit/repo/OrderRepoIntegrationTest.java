package in.ashokit.repo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import in.ashokit.entity.CustomersEntity;
import in.ashokit.entity.OrderEntity;

@DataJpaTest
@ActiveProfiles("test")
public class OrderRepoIntegrationTest {

    @Autowired
    private OrderRepo orderRepo;
    
    @Autowired
    private CustomerRepo customerRepo;

    @Test
    public void testSaveAndFindByRazorPayOrderId() {
        CustomersEntity customer = new CustomersEntity();
        customer.setCustName("Alice");
        customer.setEmail("alice@test.com");
        customer = customerRepo.save(customer);

        OrderEntity order = new OrderEntity();
        order.setRazorPayOrderId("razorpay_123");
        order.setOrderStatus("PENDING");
        order.setEmail("alice@test.com");
        order.setCustomer(customer);
        orderRepo.save(order);

        OrderEntity foundOrder = orderRepo.findByRazorPayOrderId("razorpay_123");
        
        assertNotNull(foundOrder);
        assertEquals("PENDING", foundOrder.getOrderStatus());
    }
}
