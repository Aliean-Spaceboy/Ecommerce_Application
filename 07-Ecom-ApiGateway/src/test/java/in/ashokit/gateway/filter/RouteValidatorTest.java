package in.ashokit.gateway.filter;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;

public class RouteValidatorTest {

    private final RouteValidator routeValidator = new RouteValidator();

    @Test
    public void testOpenApiEndpoints() {
        MockServerHttpRequest request1 = MockServerHttpRequest.get("/api/auth/login").build();
        assertFalse(routeValidator.isSecured.test(request1)); 
        
        assertFalse(routeValidator.isSecured.test(MockServerHttpRequest.get("/api/auth/register").build()));
    }
}
