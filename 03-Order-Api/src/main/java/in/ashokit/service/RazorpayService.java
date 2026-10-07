package in.ashokit.service;

import org.springframework.stereotype.Service;


import com.razorpay.Order;
@Service
public interface RazorpayService {
	public Order createPaymentOrder(double amount);
	public boolean verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature);
}
