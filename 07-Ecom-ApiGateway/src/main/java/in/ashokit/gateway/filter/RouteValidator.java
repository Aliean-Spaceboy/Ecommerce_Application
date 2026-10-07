package in.ashokit.gateway.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    public static final List<String> openApiEndpoints = List.of(
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/reset-pwd",
            "/api/auth/reset-password-via-link",
            "/api/auth/forget-pwd",
            "/api/products",
            "/api/product-categories",
            "/eureka"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> {
                String path = request.getURI().getPath();
                String method = request.getMethod().name();
                
                // Allow Guest Order Tracking: GET /api/orders/{email}/{trackingNum}
                if (method.equals("GET") && path.matches("^/api/orders/.+/.+$")) {
                    return false;
                }
                
                return openApiEndpoints
                        .stream()
                        .noneMatch(uri -> path.contains(uri));
            };
}
