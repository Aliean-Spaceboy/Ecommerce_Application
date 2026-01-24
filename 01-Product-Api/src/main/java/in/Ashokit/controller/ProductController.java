package in.Ashokit.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import in.Ashokit.Response.ApiResponse;
import in.Ashokit.dto.CatogoryDto;
import in.Ashokit.dto.ProductDto;
import in.Ashokit.service.ProductService;

@RestController
public class ProductController {
	@Autowired
	private ProductService productService;

	@GetMapping(value = "/category", produces = "application/json")
	public ResponseEntity<ApiResponse<List<CatogoryDto>>> getAllCategory() {
		List<CatogoryDto> allCategories = productService.findAllCategory();
		ApiResponse<List<CatogoryDto>> response = new ApiResponse<>();

		if (!allCategories.isEmpty()) {
			response.setStatus(200);
			response.setMessage("the data");
			response.setData(allCategories);
			return new ResponseEntity<>(response, HttpStatus.OK);
		} else {
			response.setStatus(500);
			response.setMessage("the data not fetched");
			response.setData(null);
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
     @GetMapping("/products/{categoryId}")
	public ResponseEntity<ApiResponse<List<ProductDto>>> getProductsByCategoryId(Integer categoryId) {
		List<ProductDto> product = productService.findProductsByCategory(categoryId);
		ApiResponse<List<ProductDto>> response = new ApiResponse<>();

		if (product.isEmpty()) {
			response.setStatus(200);
			response.setMessage("Product Not Found!");
			response.setData(Collections.emptyList());
			return new ResponseEntity<>(response, HttpStatus.OK);
		} else {
			response.setStatus(200);
			response.setMessage("Product Found");
			response.setData(product);
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
     }
		@GetMapping("/product/id/{productId}")
		public ResponseEntity<ApiResponse<ProductDto>> getProductByProductId(@PathVariable Integer productId)
		{
			ProductDto product=productService.findProductByProductId(productId);
			ApiResponse<ProductDto> response = new ApiResponse<>();
			
			if(product != null)
			{
				response.setStatus(200);
				response.setMessage("Product Find Successfully.");
				response.setData(product);
				return new ResponseEntity<>(response,HttpStatus.OK);
				
			}
			
			else
			{
				response.setStatus(500);
				response.setMessage("Product Not Found.");
				response.setData(null);
				return new ResponseEntity<>(response,HttpStatus.INTERNAL_SERVER_ERROR);
			}
			
		}
		@GetMapping("/product/name/{name}")
		public ResponseEntity<ApiResponse<List<ProductDto>>> getProductsByProudctName( @PathVariable String name)
		{
			List<ProductDto>  productName= productService.findProductsByProductName(name);
			 ApiResponse<List<ProductDto>> response= new ApiResponse<>();
			 
			 if(!productName.isEmpty())
			 {
				 response.setStatus(200);
				 response.setMessage("Product Found Succesfully!");
				 response.setData(productName);
				 return new ResponseEntity<>(response,HttpStatus.OK);
			 }
			 else
			 {
				 response.setStatus(500);
				 response.setMessage("Product Not Found!");
				 response.setData(null);
				 return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
			 }
		}
		
		
	
}
