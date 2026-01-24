package in.ashokit.entity;

import java.time.LocalDate;
import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
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

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer orderId;
	private String orderTrackingNum;
	private String razorPayOrderId;
	private String razorPayPaymentId;
	private String email;
	private String orderStatus;
	
	private double totalPrice;
	private double totalQuentity;
	
	private String invoiceUrl;
	private LocalDate deliveryDate;
	@CreationTimestamp
	@Column(updatable = false)
	private Date createdDate;
	@UpdateTimestamp
	@Column(insertable = false)
	private Date updatedDate;
	
	@ManyToOne
	@JoinColumn(name = "customerId")
	private CustomersEntity customer;
	@ManyToOne
	@JoinColumn(name = "AddressId")
	private AddressEntity address;
}
