package in.ashokit.entity;

import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter

public class CustomersEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer custId;
	private String custName;
	private String Email;
	private Long phno;
	private String password;
	private String updatedPassword;

	@CreationTimestamp
	@Column(updatable = false)
	private LocalDate insertData;
	@UpdateTimestamp
	@Column(insertable = false)
	private LocalDate updateData;
}
