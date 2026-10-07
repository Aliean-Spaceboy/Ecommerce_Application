package in.Ashokit.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import in.Ashokit.dto.CatogoryDto;
import in.Ashokit.dto.ProductDto;
import in.Ashokit.entity.CategoryEntity;
import in.Ashokit.entity.Product_Entity;
import in.Ashokit.repo.CategoryRepo;
import in.Ashokit.repo.ProductRepo;

public class ProductServiceImplTest {

    @Mock
    private CategoryRepo categoryRepo;

    @Mock
    private ProductRepo productRepo;

    @InjectMocks
    private ProductServiceImpl productService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testFindAllCategory() {
        CategoryEntity category = new CategoryEntity();
        category.setCategoryId(1);
        category.setName("Electronics");

        when(categoryRepo.findAll()).thenReturn(Arrays.asList(category));

        List<CatogoryDto> result = productService.findAllCategory();
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Electronics", result.get(0).getName());
    }

    @Test
    public void testFindAllProducts() {
        Product_Entity product = new Product_Entity();
        product.setProductId(1);
        product.setName("Laptop");
        
        CategoryEntity category = new CategoryEntity();
        category.setCategoryId(1);
        product.setCategory(category);

        when(productRepo.findAll()).thenReturn(Arrays.asList(product));

        List<ProductDto> result = productService.findAllProducts();
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Laptop", result.get(0).getName());
    }

    @Test
    public void testFindProductsByCategory() {
        Product_Entity product = new Product_Entity();
        product.setProductId(1);
        product.setName("Smartphone");
        
        CategoryEntity category = new CategoryEntity();
        category.setCategoryId(2);
        product.setCategory(category);

        when(productRepo.findByCategory_CategoryId(2)).thenReturn(Arrays.asList(product));

        List<ProductDto> result = productService.findProductsByCategory(2);
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Smartphone", result.get(0).getName());
    }

    @Test
    public void testFindProductByProductId() {
        Product_Entity product = new Product_Entity();
        product.setProductId(1);
        product.setName("Headphones");
        
        CategoryEntity category = new CategoryEntity();
        category.setCategoryId(3);
        product.setCategory(category);

        when(productRepo.findById(1)).thenReturn(Optional.of(product));

        ProductDto result = productService.findProductByProductId(1);
        assertNotNull(result);
        assertEquals("Headphones", result.getName());
    }

    @Test
    public void testFindProductByProductId_NotFound() {
        when(productRepo.findById(99)).thenReturn(Optional.empty());

        ProductDto result = productService.findProductByProductId(99);
        assertNull(result);
    }

    @Test
    public void testFindProductsByProductName() {
        Product_Entity product = new Product_Entity();
        product.setProductId(1);
        product.setName("Tablet");
        
        CategoryEntity category = new CategoryEntity();
        category.setCategoryId(4);
        product.setCategory(category);

        when(productRepo.findByname("Tablet")).thenReturn(Arrays.asList(product));

        List<ProductDto> result = productService.findProductsByProductName("Tablet");
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Tablet", result.get(0).getName());
    }
}
