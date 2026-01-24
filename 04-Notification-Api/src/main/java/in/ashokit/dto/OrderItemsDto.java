package in.ashokit.dto;

import lombok.Data;

@Data
public class OrderItemsDto {
	private String orderName;
	private Integer quantity;
	private Double unitPrice;
	private String imageUrl;
}
