package in.ashokit.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PurchaseOrderResponse {
  private String razorPayOrderId;
  private String orderStatus;
  private String orderTrackingNum;
}
