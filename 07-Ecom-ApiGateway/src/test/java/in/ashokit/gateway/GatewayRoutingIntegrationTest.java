package in.ashokit.gateway;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import in.ashokit.gateway.util.JwtUtil;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;

import static com.github.tomakehurst.wiremock.client.WireMock.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class GatewayRoutingIntegrationTest {

    @Autowired
    private WebTestClient webClient;

    @Autowired
    private JwtUtil jwtUtil;

    private static WireMockServer wireMockServer;

    @BeforeAll
    static void setUp() {
        wireMockServer = new WireMockServer(WireMockConfiguration.wireMockConfig().dynamicPort());
        wireMockServer.start();
        WireMock.configureFor("localhost", wireMockServer.port());
    }

    @AfterAll
    static void tearDown() {
        wireMockServer.stop();
    }

    @DynamicPropertySource
    static void dynamicProperties(DynamicPropertyRegistry registry) {
        String wiremockUrl = "http://localhost:" + wireMockServer.port();
        registry.add("CUSTOMER_API_URL", () -> wiremockUrl);
        registry.add("PRODUCT_API_URL", () -> wiremockUrl);
        registry.add("ORDER_API_URL", () -> wiremockUrl);
        registry.add("JWT_SECRET", () -> "bXl0ZXN0c2VjcmV0a2V5dGhhdGlzdmVyeXZlcnlsb25n");
    }

    private String generateValidToken() {
        String secret = "bXl0ZXN0c2VjcmV0a2V5dGhhdGlzdmVyeXZlcnlsb25n"; // "mytestsecretkeythatisveryverylong" in base64
        java.security.Key key = io.jsonwebtoken.security.Keys.hmacShaKeyFor(io.jsonwebtoken.io.Decoders.BASE64.decode(secret));
        String token = io.jsonwebtoken.Jwts.builder()
                .setSubject("test@test.com")
                .claim("role", "CUSTOMER")
                .setIssuedAt(new java.util.Date(System.currentTimeMillis()))
                .setExpiration(new java.util.Date(System.currentTimeMillis() + 1000 * 60 * 30))
                .signWith(key, io.jsonwebtoken.SignatureAlgorithm.HS256).compact();
        return "Bearer " + token;
    }

    @Test
    void testGw01_AuthRoute_Public() {
        stubFor(any(urlMatching(".*"))
                .willReturn(aResponse().withStatus(200).withBody("auth-success")));

        // Gateway config: Path=/api/auth/** -> StripPrefix=2
        // So /api/auth/login -> /login
        webClient.post().uri("/api/auth/login")
                .exchange()
                .expectStatus().isOk();

        verify(postRequestedFor(urlEqualTo("/login")));
        
        webClient.post().uri("/api/auth/register")
                .exchange()
                .expectStatus().isOk();

        verify(postRequestedFor(urlEqualTo("/register")));
    }

    @Test
    void testGw02_ProductCategories() {
        stubFor(get(urlEqualTo("/category"))
                .willReturn(aResponse().withStatus(200)));

        webClient.get().uri("/api/product-categories")
                .exchange()
                .expectStatus().isOk();

        verify(getRequestedFor(urlEqualTo("/category")));
    }

    @Test
    void testGw03_AllProducts() {
        stubFor(get(urlEqualTo("/products"))
                .willReturn(aResponse().withStatus(200)));

        webClient.get().uri("/api/products")
                .exchange()
                .expectStatus().isOk();

        verify(getRequestedFor(urlEqualTo("/products")));
    }

    @Test
    void testGw04_ProductsByCategory() {
        stubFor(get(urlMatching("/products/\\d+"))
                .willReturn(aResponse().withStatus(200)));

        webClient.get().uri("/api/products/category/5")
                .exchange()
                .expectStatus().isOk();

        verify(getRequestedFor(urlEqualTo("/products/5")));
    }

    @Test
    void testGw05_ProductDetails() {
        stubFor(get(urlMatching("/product/id/\\d+"))
                .willReturn(aResponse().withStatus(200)));

        webClient.get().uri("/api/products/10")
                .exchange()
                .expectStatus().isOk();

        verify(getRequestedFor(urlEqualTo("/product/id/10")));
    }

    @Test
    void testGw06_CreateOrder_Secured() {
        stubFor(post(urlEqualTo("/order"))
                .willReturn(aResponse().withStatus(200)));

        // Unauthenticated -> 401
        webClient.post().uri("/api/orders")
                .exchange()
                .expectStatus().isUnauthorized();

        // Authenticated -> 200
        webClient.post().uri("/api/orders")
                .header("Authorization", generateValidToken())
                .exchange()
                .expectStatus().isOk();

        verify(postRequestedFor(urlEqualTo("/order")));
        
        // Method restriction test: GET to /api/orders should be 404 from Gateway (no route matches)
        webClient.get().uri("/api/orders")
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void testGw07_ChatbotTrackOrder_Public() {
        stubFor(get(urlEqualTo("/orders/test@test.com/TRACK123"))
                .willReturn(aResponse().withStatus(200)));

        webClient.get().uri("/api/orders/test@test.com/TRACK123")
                .exchange()
                .expectStatus().isOk();

        verify(getRequestedFor(urlEqualTo("/orders/test@test.com/TRACK123")));
    }
}
