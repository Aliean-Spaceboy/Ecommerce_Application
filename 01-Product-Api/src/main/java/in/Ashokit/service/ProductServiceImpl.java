package in.Ashokit.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.Ashokit.dto.CatogoryDto;
import in.Ashokit.dto.ProductDto;
import in.Ashokit.mapper.CategoryMapper;
import in.Ashokit.mapper.ProductMapper;
import in.Ashokit.repo.CategoryRepo;
import in.Ashokit.repo.ProductRepo;

@Service
public class ProductServiceImpl implements ProductService {
	@Autowired
	private CategoryRepo categoryRepo;

	@Autowired
	private ProductRepo productRepo;

	@Override
	public List<CatogoryDto> findAllCategory() {

		return categoryRepo.findAll().stream().map(CategoryMapper::convertToDto).collect(Collectors.toList());

	}

	// productbased on category id
	@Override
	public List<ProductDto> findProductsByCategory(Integer categoryId) {
		return productRepo.findByCategory_CategoryId(categoryId).stream().map(ProductMapper::convertToDto)
				.collect(Collectors.toList());
	}

	// find product by productid
	@Override
	public ProductDto findProductByProductId(Integer productId) {
		return productRepo.findById(productId).map(ProductMapper::convertToDto).orElse(null);

	}

	// find product based on productname
	@Override
	public List<ProductDto> findProductsByProductName(String name) {
		return productRepo.findByname(name).stream().map(ProductMapper::convertToDto).collect(Collectors.toList());
	}

}
