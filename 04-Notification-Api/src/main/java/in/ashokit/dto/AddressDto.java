package in.ashokit.dto;

import lombok.Data;

@Data
public class AddressDto {
	private String houseNum;
	private String street;
	private String city;
	private String state;
	private Integer zipcode;
}
