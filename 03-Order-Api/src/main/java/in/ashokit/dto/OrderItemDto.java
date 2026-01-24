package in.ashokit.dto;

import lombok.Data;

@Data
public class OrderItemDto {
	private Integer orderid;
	private String orderName;
	private Long quentity;
	private Double unitPrice;
	private String imageUrl;
}
