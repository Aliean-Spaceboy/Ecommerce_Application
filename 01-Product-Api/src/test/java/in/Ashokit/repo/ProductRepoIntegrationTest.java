package in.Ashokit.repo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import in.Ashokit.entity.CategoryEntity;
import in.Ashokit.entity.Product_Entity;

@DataJpaTest
@ActiveProfiles("test")
public class ProductRepoIntegrationTest {

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private ProductRepo productRepo;

    @Test
    public void testSaveAndFindProduct() {
        CategoryEntity category = new CategoryEntity();
        category.setName("Electronics");
        category = categoryRepo.save(category);

        Product_Entity product = new Product_Entity();
        product.setName("Smartphone");
        product.setCategory(category);
        productRepo.save(product);

        List<Product_Entity> products = productRepo.findByname("Smartphone");
        assertNotNull(products);
        assertEquals(1, products.size());
        assertEquals("Electronics", products.get(0).getCategory().getName());
    }
}
