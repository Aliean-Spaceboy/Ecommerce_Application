package in.ashokit.entity;

import java.math.BigDecimal;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductEntity
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer productId;
	private String productName;
	private String Summary;
	private String title;
	private Boolean active;
	private BigDecimal quantity;
	private  Long unitPrice;

	 private Date createdDate;
	 private Date updatedDate;
	 
	 @ManyToOne
	 @JoinColumn(name = "category_id")
	 private CategoryEntity category;
}
