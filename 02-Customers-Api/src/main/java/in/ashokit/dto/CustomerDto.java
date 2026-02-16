package in.ashokit.dto;
import java.time.LocalDate;

import lombok.Data;
@Data
public class CustomerDto {

	private Integer customerId;
	private String name;
	private String email;
	private Long phno;
	private String password;
	private String passwordUpdated;

	private LocalDate createdAt;

	private LocalDate lastUpdated;
}
