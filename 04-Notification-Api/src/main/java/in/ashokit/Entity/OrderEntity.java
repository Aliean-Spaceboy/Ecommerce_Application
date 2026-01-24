package in.ashokit.Entity;

import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class OrderEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer orderId;
	private String orderTrackingNum;
	private String razorPayOrderId;
	private String razorPayPaymentId;
	private String email;
	private String orderStatus;
	private Double totalPrice;
	private Integer totalQuentity;
	private String invoiceUrl;
	private LocalDate deleveryDate;

	@UpdateTimestamp
	@Column(insertable = false)
	private LocalDate updateDate;
	@CreationTimestamp
	@Column(updatable = false)
	private LocalDate createdDate;

	@ManyToOne
	@JoinColumn(name = "customer_id")
	private CustomerEntity customerEntity;
	@ManyToOne
	@JoinColumn(name = "address_id")
	private AddressEntity addressEntity;

}
