package in.ashokit.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;


@Service
public class RazorpayServiceImpl implements RazorpayService {
	private RazorpayClient razorpayClient;
	private boolean isMockEnabled;
	private String keySecret;

	public RazorpayServiceImpl(@Value("${razorpay.id}") String keyId, @Value("${razorpay.secret}") String keySecret, @Value("${payment.mock.enabled:false}") boolean isMockEnabled) {
		System.out.println("Razorpay ID:" + keyId);
		System.out.println("Razorpay Secret:" + keySecret);
		this.keySecret = keySecret;
		this.isMockEnabled = isMockEnabled;
		try {
			this.razorpayClient = new RazorpayClient(keyId, keySecret);
		} catch (Exception e) {
			System.err.println("Failed to initialize Razorpay Client: " + e.getMessage());
		}
	}

	@Override
	public Order createPaymentOrder(double amount) {
		if (isMockEnabled) {
			System.out.println("Using Mock Razorpay Order (payment.mock.enabled=true)");
			try {
				JSONObject mockResponse = new JSONObject();
				mockResponse.put("id", "order_mock_" + System.currentTimeMillis());
				mockResponse.put("status", "created");
				return new Order(mockResponse);
			} catch (Exception e) {
				throw new RuntimeException("Failed to mock Razorpay order", e);
			}
		}

		JSONObject orderRequest = new JSONObject();
		orderRequest.put("amount", amount * 100);
		orderRequest.put("currency", "INR");
		orderRequest.put("payment_capture", 1);

		try {
			if (razorpayClient != null) {
				return razorpayClient.orders.create(orderRequest);
			} else {
				throw new RuntimeException("RazorpayClient is null. Missing valid credentials?");
			}
		} catch (Exception e) {
			throw new RuntimeException("Failed to create Razorpay order. (To test without real credentials, set payment.mock.enabled=true): " + e.getMessage(), e);
		}
	}

	@Override
	public boolean verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
		if (isMockEnabled) {
			if ("invalid_signature".equals(razorpaySignature)) {
				return false;
			}
			return true;
		}
		
		try {
			JSONObject options = new JSONObject();
			options.put("razorpay_order_id", razorpayOrderId);
			options.put("razorpay_payment_id", razorpayPaymentId);
			options.put("razorpay_signature", razorpaySignature);
			
			return com.razorpay.Utils.verifyPaymentSignature(options, keySecret);
		} catch (Exception e) {
			System.err.println("Exception during signature verification: " + e.getMessage());
			return false;
		}
	}

}
