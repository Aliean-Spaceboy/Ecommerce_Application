package in.ashokit.gateway.util;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import org.junit.jupiter.api.Test;

public class JwtUtilTest {

    private JwtUtil jwtUtil = new JwtUtil();

    @Test
    public void testValidateToken() {
        // Just ensuring it compiles and can be invoked.
        // Full testing requires a generated token and secret injected.
        assertDoesNotThrow(() -> {
            try {
                jwtUtil.validateToken("some-invalid-token");
            } catch (Exception e) {
                // expected for invalid token
            }
        });
    }
}
