package in.ashokit.entity;

import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "customer_tbl")
public class CustomersEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "customerId")
	private Integer custId;
	
	@Column(name = "name")
	private String custName;
	private String email;
	private Long phno;
	private String password;
	@Column(name = "password_updated")
	private String updatedPassword;

	@CreationTimestamp
	@Column(name = "created_at", updatable = false)
	private LocalDate insertData;
	@UpdateTimestamp
	@Column(name = "last_updated", insertable = false)
	private LocalDate updateData;
}
