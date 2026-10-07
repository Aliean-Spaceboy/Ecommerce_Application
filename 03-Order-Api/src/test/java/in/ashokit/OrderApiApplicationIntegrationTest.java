package in.ashokit;

import com.fasterxml.jackson.databind.ObjectMapper;
import in.ashokit.dto.AddressDto;
import in.ashokit.dto.CustomerDto;
import in.ashokit.dto.OrderDto;
import in.ashokit.dto.OrderItemDto;
import in.ashokit.entity.CustomersEntity;
import in.ashokit.entity.OrderEntity;
import in.ashokit.repo.AddressRepo;
import in.ashokit.repo.CustomerRepo;
import in.ashokit.repo.OrderItemsRepo;
import in.ashokit.repo.OrderRepo;
import in.ashokit.request.PurcheseOrderRequest;
import in.ashokit.service.EmailService;
import in.ashokit.service.RazorpayService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class OrderApiApplicationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private OrderItemsRepo orderItemsRepo;

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private AddressRepo addressRepo;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RazorpayService razorpayService;

    @MockBean
    private EmailService emailService;

    @BeforeEach
    void setUp() throws Exception {
        orderItemsRepo.deleteAll();
        orderRepo.deleteAll();
        addressRepo.deleteAll();
        customerRepo.deleteAll();

        com.razorpay.Order mockRazorpayOrder = new com.razorpay.Order(new org.json.JSONObject("{\"id\":\"order_mock123\"}"));
        doReturn(mockRazorpayOrder).when(razorpayService).createPaymentOrder(any(Double.class));
        doReturn(true).when(emailService).sendEmail(any(String.class), any(String.class), any(String.class));
    }

    @Test
    void testCreateOrder() throws Exception {
        PurcheseOrderRequest request = new PurcheseOrderRequest();
        
        CustomerDto customerDto = new CustomerDto();
        customerDto.setCustName("John Doe");
        customerDto.setCustEmail("john.doe@example.com");
        customerDto.setPhno(1234567890L);
        request.setCustomerDto(customerDto);

        AddressDto addressDto = new AddressDto();
        addressDto.setCity("New York");
        addressDto.setState("NY");
        addressDto.setStreet("5th Ave");
        addressDto.setZipcode("10001");
        request.setAddressDto(addressDto);

        OrderDto orderDto = new OrderDto();
        orderDto.setTotalPrice(100.0);
        orderDto.setTotalQuentity(2.0);
        request.setOrderDto(orderDto);

        OrderItemDto itemDto = new OrderItemDto();
        itemDto.setOrderName("Product1");
        itemDto.setQuentity(2L);
        itemDto.setUnitPrice(50.0);
        request.setOrderItemDto(Collections.singletonList(itemDto));

        mockMvc.perform(post("/order")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.orderTrackingNum").exists())
                .andExpect(jsonPath("$.data.razorPayOrderId").value("order_mock123"));

        // ORD-ISO-004 Persistence verification
        org.junit.jupiter.api.Assertions.assertEquals(1, customerRepo.findAll().size());
        org.junit.jupiter.api.Assertions.assertEquals(1, addressRepo.findAll().size());
        org.junit.jupiter.api.Assertions.assertEquals(1, orderRepo.findAll().size());
        org.junit.jupiter.api.Assertions.assertEquals(1, orderItemsRepo.findAll().size());
    }

    @Test
    void testCreateOrder_RazorpayFailure() throws Exception {
        // Mock failure
        org.mockito.Mockito.doThrow(new RuntimeException("Failed to create Razorpay order. (To test without real credentials, set payment.mock.enabled=true): BAD_REQUEST_ERROR:Authentication failed"))
                .when(razorpayService).createPaymentOrder(any(Double.class));

        PurcheseOrderRequest request = new PurcheseOrderRequest();
        
        CustomerDto customerDto = new CustomerDto();
        customerDto.setCustName("John Doe");
        customerDto.setCustEmail("john.doe.fail@example.com");
        customerDto.setPhno(1234567890L);
        request.setCustomerDto(customerDto);

        AddressDto addressDto = new AddressDto();
        addressDto.setCity("New York");
        addressDto.setState("NY");
        addressDto.setStreet("5th Ave");
        addressDto.setZipcode("10001");
        request.setAddressDto(addressDto);

        OrderDto orderDto = new OrderDto();
        orderDto.setTotalPrice(100.0);
        orderDto.setTotalQuentity(2.0);
        request.setOrderDto(orderDto);

        OrderItemDto itemDto = new OrderItemDto();
        itemDto.setOrderName("Product1");
        itemDto.setQuentity(2L);
        itemDto.setUnitPrice(50.0);
        request.setOrderItemDto(Collections.singletonList(itemDto));

        // Expect exception due to Razorpay failure (OrderRestController doesn't catch RuntimeException)
        try {
            mockMvc.perform(post("/order")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));
            org.junit.jupiter.api.Assertions.fail("Expected exception to be thrown");
        } catch (Exception e) {
            org.junit.jupiter.api.Assertions.assertTrue(e.getCause() instanceof RuntimeException);
            org.junit.jupiter.api.Assertions.assertTrue(e.getCause().getMessage().contains("BAD_REQUEST_ERROR:Authentication failed"));
        }

        // ORD-ISO-007 Transaction rollback verification
        // Customer and Address should NOT be persisted because of @Transactional rollback
        org.junit.jupiter.api.Assertions.assertEquals(0, customerRepo.findAll().size(), "Customer was persisted despite failure!");
        org.junit.jupiter.api.Assertions.assertEquals(0, addressRepo.findAll().size(), "Address was persisted despite failure!");
        
        // Order and OrderItems are not persisted because the exception happened before save()
        org.junit.jupiter.api.Assertions.assertEquals(0, orderRepo.findAll().size(), "Order should not be persisted");
        org.junit.jupiter.api.Assertions.assertEquals(0, orderItemsRepo.findAll().size(), "OrderItems should not be persisted");
    }

    @Test
    void testTrackOrder() throws Exception {
        CustomersEntity customer = new CustomersEntity();
        customer.setCustName("Jane Doe");
        customer.setEmail("jane.doe@example.com");
        customer.setPhno(9876543210L);
        customerRepo.save(customer);

        OrderEntity order = new OrderEntity();
        order.setOrderTrackingNum(UUID.randomUUID().toString());
        order.setTotalPrice(200.0);
        order.setTotalQuentity(1.0);
        order.setOrderStatus("CREATED");
        order.setCustomer(customer);
        order.setEmail(customer.getEmail());
        orderRepo.save(order);

        mockMvc.perform(get("/orders/{email}/{trackingNum}", customer.getEmail(), order.getOrderTrackingNum()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.orderTrackingNum").value(order.getOrderTrackingNum()));
    }
}
