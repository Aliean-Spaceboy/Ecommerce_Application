package in.ashokit.request;

import java.util.List;

import in.ashokit.dto.AddressDto;
import in.ashokit.dto.CustomerDto;
import in.ashokit.dto.OrderDto;
import in.ashokit.dto.OrderItemDto;
import lombok.Data;

@Data
public class PurcheseOrderRequest {
	
	private AddressDto addressDto;
	private CustomerDto customerDto;
	private OrderDto orderDto;
	private List<OrderItemDto> orderItemDto;

}
