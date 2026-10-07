package in.ashokit.rest;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import in.ashokit.dto.OrderDto;
import in.ashokit.request.PurcheseOrderRequest;
import in.ashokit.response.PurchaseOrderResponse;
import in.ashokit.service.OrderService;

@WebMvcTest(OrderRestController.class)
public class OrderRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreateOrder() throws Exception {
        PurcheseOrderRequest request = new PurcheseOrderRequest();
        PurchaseOrderResponse response = PurchaseOrderResponse.builder()
            .orderTrackingNum("OD123")
            .razorPayOrderId("order_test")
            .orderStatus("created")
            .build();

        when(orderService.createOrder(any(PurcheseOrderRequest.class))).thenReturn(response);

        mockMvc.perform(post("/order")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.orderTrackingNum").value("OD123"));
    }

    @Test
    public void testTrackOrder_Success() throws Exception {
        OrderDto orderDto = new OrderDto();
        orderDto.setOrderTrackingNum("TRACK123");
        
        when(orderService.trackOrder(anyString(), anyString())).thenReturn(orderDto);

        mockMvc.perform(get("/orders/test@test.com/TRACK123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.orderTrackingNum").value("TRACK123"));
    }

    @Test
    public void testTrackOrder_NotFound() throws Exception {
        when(orderService.trackOrder(anyString(), anyString())).thenReturn(null);

        mockMvc.perform(get("/orders/test@test.com/TRACK999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
