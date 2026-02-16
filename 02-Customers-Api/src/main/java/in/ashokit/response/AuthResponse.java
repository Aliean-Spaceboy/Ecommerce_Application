package in.ashokit.response;




import in.ashokit.dto.CustomerDto;
import lombok.Data;

@Data
public class AuthResponse {
	private CustomerDto customer;
	private String token;
}
