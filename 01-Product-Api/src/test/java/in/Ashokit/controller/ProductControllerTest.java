package in.Ashokit.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import in.Ashokit.Response.ApiResponse;
import in.Ashokit.dto.CatogoryDto;
import in.Ashokit.dto.ProductDto;
import in.Ashokit.service.ProductService;

public class ProductControllerTest {

    private ProductController productController;
    private ProductService productService;

    @BeforeEach
    public void setup() {
        productController = new ProductController();
        productService = mock(ProductService.class);
        ReflectionTestUtils.setField(productController, "productService", productService);
    }

    @Test
    public void testGetAllCategory_Success() {
        CatogoryDto category = new CatogoryDto();
        category.setName("Electronics");
        when(productService.findAllCategory()).thenReturn(Arrays.asList(category));

        ResponseEntity<ApiResponse<List<CatogoryDto>>> response = productController.getAllCategory();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(200, response.getBody().getStatus());
        assertEquals(1, response.getBody().getData().size());
    }

    @Test
    public void testGetAllCategory_NotFound() {
        when(productService.findAllCategory()).thenReturn(Collections.emptyList());

        ResponseEntity<ApiResponse<List<CatogoryDto>>> response = productController.getAllCategory();
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(404, response.getBody().getStatus());
    }

    @Test
    public void testGetAllProducts_Success() {
        ProductDto product = new ProductDto();
        when(productService.findAllProducts()).thenReturn(Arrays.asList(product));

        ResponseEntity<ApiResponse<List<ProductDto>>> response = productController.getAllProducts();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(200, response.getBody().getStatus());
        assertEquals(1, response.getBody().getData().size());
    }

    @Test
    public void testGetProductsByCategoryId_NotFound() {
        when(productService.findProductsByCategory(99)).thenReturn(Collections.emptyList());

        ResponseEntity<ApiResponse<List<ProductDto>>> response = productController.getProductsByCategoryId(99);
        // Controller returns 200 OK even when list is empty
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(200, response.getBody().getStatus());
        assertEquals(0, response.getBody().getData().size());
    }

    @Test
    public void testGetProductByProductId_NotFound() {
        when(productService.findProductByProductId(99)).thenReturn(null);

        ResponseEntity<ApiResponse<ProductDto>> response = productController.getProductByProductId(99);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(404, response.getBody().getStatus());
    }
}
