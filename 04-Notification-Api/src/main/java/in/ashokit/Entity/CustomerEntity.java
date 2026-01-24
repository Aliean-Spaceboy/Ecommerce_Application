package in.ashokit.Entity;

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
public class CustomerEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer customerId;
	private String customerName;
	private Long customerPhno;
	private String Email;
	private String password;
	private String updatedPassword;

	@CreationTimestamp
	@Column(updatable = false)
	private LocalDate createdTime;
	@UpdateTimestamp
	@Column(insertable = false)
	private LocalDate updatedTime;
}
