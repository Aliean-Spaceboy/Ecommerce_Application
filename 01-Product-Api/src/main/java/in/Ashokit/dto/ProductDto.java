package in.Ashokit.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ProductDto {
	private Integer productId;
	private String name;
	private String title;
	private String description;
	private BigDecimal unitPrice;
	private String imgUrl;
	private boolean active;
	private Integer catogoryId;
	private Integer unitStock;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
}
