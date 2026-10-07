package in.ashokit.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import in.ashokit.dto.OrderDto;
import in.ashokit.dto.PaymentCallBackDto;
import in.ashokit.request.PurcheseOrderRequest;
import in.ashokit.response.ApiResponse;
import in.ashokit.response.PurchaseOrderResponse;
import in.ashokit.service.OrderService;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class OrderRestController {
	@Autowired
	private OrderService orderService;

	@PostMapping("/order")
	public ResponseEntity<ApiResponse<PurchaseOrderResponse>> creteOrder(@RequestBody PurcheseOrderRequest request) {
		ApiResponse<PurchaseOrderResponse> response = new ApiResponse<>();

		PurchaseOrderResponse ordresp = orderService.createOrder(request);

		if (ordresp != null) {
			response.setStatus(200);
			response.setMessage("Order Created");
			response.setData(ordresp);
			return new ResponseEntity<ApiResponse<PurchaseOrderResponse>>(response, HttpStatus.OK);
		} else {
			response.setStatus(500);
			response.setMessage("Order Not Created");
			response.setData(null);
			return new ResponseEntity<ApiResponse<PurchaseOrderResponse>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PutMapping("/order")
	public ResponseEntity<ApiResponse<PurchaseOrderResponse>> updateOrder(@RequestBody PaymentCallBackDto paymentCallBackDto) {
		ApiResponse<PurchaseOrderResponse> response = new ApiResponse<>();

		PurchaseOrderResponse ordrResp = orderService.updateOrder(paymentCallBackDto);

		if (ordrResp != null) {
			response.setStatus(200);
			response.setMessage("Order Update!");
			response.setData(ordrResp);
			return new ResponseEntity<ApiResponse<PurchaseOrderResponse>>(response, HttpStatus.OK);
		} else {
			response.setStatus(500);
			response.setMessage("Order update failed!");
			response.setData(null);
			return new ResponseEntity<ApiResponse<PurchaseOrderResponse>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/orders/{email}/{trackingNum}")
	public ResponseEntity<ApiResponse<OrderDto>> trackOrder(@PathVariable String email, @PathVariable String trackingNum) {
		ApiResponse<OrderDto> response = new ApiResponse<>();

		OrderDto ordrresp = orderService.trackOrder(email, trackingNum);

		if (ordrresp != null) {
			response.setStatus(200);
			response.setMessage("Order Fetch SuccessFull");
			response.setData(ordrresp);
			return new ResponseEntity<ApiResponse<OrderDto>>(response, HttpStatus.OK);
		} else {
			response.setStatus(404);
			response.setMessage("Invalid Email or Tracking Number!");
			response.setData(null);
			return new ResponseEntity<ApiResponse<OrderDto>>(response, HttpStatus.NOT_FOUND);
		}
	}

}
