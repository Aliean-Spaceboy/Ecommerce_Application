package in.ashokit.Entity;

import java.math.BigDecimal;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class ProductEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer productId;
	private String productName;
	private String productDesc;
	private String productTitel;
	private Long unitPrice;
	private String imageUrl;
	private boolean active;
	private BigDecimal unitStock;

	private Date Datecreated;

	private Date Dateupdated;

	@ManyToOne
	@JoinColumn(name = "category_id")
	private CategoryEntity categoryEnity;

}
