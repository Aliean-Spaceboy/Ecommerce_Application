package in.ashokit.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import in.ashokit.dto.AddressDto;
import in.ashokit.dto.CustomerDto;
import in.ashokit.dto.OrderDto;
import in.ashokit.dto.PaymentCallBackDto;
import in.ashokit.entity.AddressEntity;
import in.ashokit.entity.CustomersEntity;
import in.ashokit.entity.OrderEntity;
import in.ashokit.repo.AddressRepo;
import in.ashokit.repo.CustomerRepo;
import in.ashokit.repo.OrderItemsRepo;
import in.ashokit.repo.OrderRepo;
import in.ashokit.request.PurcheseOrderRequest;
import in.ashokit.response.PurchaseOrderResponse;

public class OrderServiceImplTest {

    @Mock
    private AddressRepo addRepo;
    
    @Mock
    private CustomerRepo customerRepo;
    
    @Mock
    private OrderItemsRepo orderItemsRepo;
    
    @Mock
    private OrderRepo orderRepo;
    
    @Mock
    private EmailService emailService;
    
    @Mock
    private RazorpayService razorpayService;
    
    @InjectMocks
    private OrderServiceImpl orderService;
    
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    public void testCreateOrder() throws Exception {
        PurcheseOrderRequest request = new PurcheseOrderRequest();
        
        AddressDto addressDto = new AddressDto();
        request.setAddressDto(addressDto);
        
        CustomerDto customerDto = new CustomerDto();
        customerDto.setCustEmail("test@test.com");
        request.setCustomerDto(customerDto);
        
        OrderDto orderDto = new OrderDto();
        orderDto.setTotalPrice(100.0);
        orderDto.setTotalQuentity(2);
        request.setOrderDto(orderDto);
        
        request.setOrderItemDto(Collections.emptyList());
        
        when(customerRepo.findByEmail(anyString())).thenReturn(new CustomersEntity());
        when(addRepo.save(any(AddressEntity.class))).thenReturn(new AddressEntity());
        
        com.razorpay.Order mockRazorpayOrder = new com.razorpay.Order(new org.json.JSONObject("{\"id\": \"order_mock\", \"status\": \"created\"}"));
        when(razorpayService.createPaymentOrder(any(Double.class))).thenReturn(mockRazorpayOrder);
        when(orderRepo.save(any(OrderEntity.class))).thenReturn(new OrderEntity());
        
        PurchaseOrderResponse response = orderService.createOrder(request);
        
        assertNotNull(response);
        assertEquals("order_mock", response.getRazorPayOrderId());
    }

    @Test
    public void testUpdateOrder_Success() {
        PaymentCallBackDto dto = new PaymentCallBackDto();
        dto.setRazorPayOrderId("order_mock");
        dto.setRazorPayPaymentId("pay_mock");
        dto.setRazorPaySignature("valid_signature");
        
        OrderEntity entity = new OrderEntity();
        entity.setRazorPayOrderId("order_mock");
        entity.setEmail("test@test.com");
        
        when(orderRepo.findByRazorPayOrderId("order_mock")).thenReturn(entity);
        when(razorpayService.verifyPaymentSignature("order_mock", "pay_mock", "valid_signature")).thenReturn(true);
        when(orderRepo.save(any(OrderEntity.class))).thenReturn(entity);
        
        PurchaseOrderResponse response = orderService.updateOrder(dto);
        assertNotNull(response);
        assertEquals("CONFIRMED", response.getOrderStatus());
    }

    @Test
    public void testUpdateOrder_InvalidSignature() {
        PaymentCallBackDto dto = new PaymentCallBackDto();
        dto.setRazorPayOrderId("order_mock");
        dto.setRazorPayPaymentId("pay_mock");
        dto.setRazorPaySignature("invalid_signature");
        
        OrderEntity entity = new OrderEntity();
        entity.setRazorPayOrderId("order_mock");
        entity.setEmail("test@test.com");
        
        when(orderRepo.findByRazorPayOrderId("order_mock")).thenReturn(entity);
        when(razorpayService.verifyPaymentSignature("order_mock", "pay_mock", "invalid_signature")).thenReturn(false);
        
        assertThrows(IllegalArgumentException.class, () -> {
            orderService.updateOrder(dto);
        });
        
        assertEquals("FAILED", entity.getOrderStatus());
    }

    @Test
    public void testFindbyEmail() {
        when(orderRepo.findByEmail("test@test.com")).thenReturn(Collections.singletonList(new OrderEntity()));
        
        List<OrderDto> result = orderService.findbyEmail("test@test.com");
        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    public void testTrackOrder() {
        OrderEntity entity = new OrderEntity();
        entity.setOrderTrackingNum("TRACK123");
        
        when(orderRepo.findByEmailAndOrderTrackingNum("test@test.com", "TRACK123")).thenReturn(entity);
        
        OrderDto result = orderService.trackOrder("test@test.com", "TRACK123");
        assertNotNull(result);
        assertEquals("TRACK123", result.getOrderTrackingNum());
    }
}
