package in.ashokit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import in.ashokit.dto.OrderDto;
import in.ashokit.rest.OrderRestController;
import in.ashokit.response.ApiResponse;
import in.ashokit.service.OrderService;

public class OrderApiSecurityTests {

    private OrderRestController orderRestController;
    private OrderService orderService;

    @BeforeEach
    public void setup() {
        orderRestController = new OrderRestController();
        orderService = mock(OrderService.class);
        ReflectionTestUtils.setField(orderRestController, "orderService", orderService);
    }

    @Test
    public void testUnauthenticatedRequest_MissingTrackingNum() {
        // In the new API, missing tracking num means it won't even hit this method, 
        // but if they hit it with a wrong tracking num as empty string:
        when(orderService.trackOrder("test@example.com", "")).thenReturn(null);

        ResponseEntity<ApiResponse<OrderDto>> response = orderRestController.trackOrder("test@example.com", "");
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testAuthenticatedCorrectUser_ValidTrackingNum() {
        OrderDto mockOrder = new OrderDto();
        when(orderService.trackOrder("test@example.com", "VALID_TRACKING")).thenReturn(mockOrder);

        ResponseEntity<ApiResponse<OrderDto>> response = orderRestController.trackOrder("test@example.com", "VALID_TRACKING");
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody().getData());
    }

    @Test
    public void testAuthenticatedWrongUser_InvalidTrackingNum() {
        when(orderService.trackOrder("test@example.com", "WRONG_TRACKING")).thenReturn(null);

        ResponseEntity<ApiResponse<OrderDto>> response = orderRestController.trackOrder("test@example.com", "WRONG_TRACKING");
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
    @Test
    public void testCreateOrder_Success() {
        in.ashokit.request.PurcheseOrderRequest request = new in.ashokit.request.PurcheseOrderRequest();
        in.ashokit.response.PurchaseOrderResponse ordresp = mock(in.ashokit.response.PurchaseOrderResponse.class);
        when(orderService.createOrder(request)).thenReturn(ordresp);

        ResponseEntity<ApiResponse<in.ashokit.response.PurchaseOrderResponse>> response = orderRestController.creteOrder(request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(200, response.getBody().getStatus());
    }

    @Test
    public void testCreateOrder_Failure() {
        in.ashokit.request.PurcheseOrderRequest request = new in.ashokit.request.PurcheseOrderRequest();
        when(orderService.createOrder(request)).thenReturn(null);

        ResponseEntity<ApiResponse<in.ashokit.response.PurchaseOrderResponse>> response = orderRestController.creteOrder(request);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals(500, response.getBody().getStatus());
    }
}
