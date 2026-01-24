package in.ashokit.response;

import lombok.Data;

@Data
public class ApiResponse<T> {
	public Integer status;
	public String message;
	public T Data;
}
