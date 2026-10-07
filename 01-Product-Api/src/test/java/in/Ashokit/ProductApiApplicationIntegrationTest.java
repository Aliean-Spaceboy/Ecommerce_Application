package in.Ashokit;

import in.Ashokit.entity.CategoryEntity;
import in.Ashokit.entity.Product_Entity;
import in.Ashokit.repo.CategoryRepo;
import in.Ashokit.repo.ProductRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ProductApiApplicationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private ProductRepo productRepo;

    @BeforeEach
    void setUp() {
        productRepo.deleteAll();
        categoryRepo.deleteAll();

        CategoryEntity category = new CategoryEntity();
        category.setName("Test Category");
        category = categoryRepo.save(category);

        Product_Entity product = new Product_Entity();
        product.setName("Test Product");
        product.setTitle("Test Title");
        product.setDescription("Test Description");
        product.setUnitPrice(new BigDecimal("99.99"));
        product.setImgUrl("test-url");
        product.setActive(true);
        product.setUnitStock(10);
        product.setCategory(category);
        productRepo.save(product);
    }

    @Test
    void testGetAllCategories() throws Exception {
        mockMvc.perform(get("/category"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data[0].name").value("Test Category"));
    }

    @Test
    void testGetAllProducts() throws Exception {
        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data[0].name").value("Test Product"));
    }

    @Test
    void testGetProductsByCategory() throws Exception {
        Integer categoryId = categoryRepo.findAll().get(0).getCategoryId();
        mockMvc.perform(get("/products/" + categoryId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data[0].name").value("Test Product"));
    }

    @Test
    void testGetProductById() throws Exception {
        Integer productId = productRepo.findAll().get(0).getProductId();
        mockMvc.perform(get("/product/id/" + productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.name").value("Test Product"));
    }
}
