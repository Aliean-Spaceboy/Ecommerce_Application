package in.ashokit.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class OrderDto {
	private String orderTrackingNum;
	private String razorPayOrderId;
	private String razorPayPaymentId;
	private String email;
	private String orderStatus;

	private double totalPrice;
	private double totalQuentity;

	private String invoiceUrl;
	private LocalDate deliveryDate;

}
