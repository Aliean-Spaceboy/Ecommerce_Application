package in.Ashokit.service;

import java.util.List;

import org.springframework.stereotype.Service;

import in.Ashokit.dto.CatogoryDto;
import in.Ashokit.dto.ProductDto;


public interface ProductService {
	// togetallcategory
	public List<CatogoryDto> findAllCategory();

	// productbased on category id
	public List<ProductDto> findProductsByCategory(Integer categoryId);

	// find product by productid
	public ProductDto findProductByProductId(Integer productId);

	// find product based on productname
	public List<ProductDto >findProductsByProductName(String name);

}
