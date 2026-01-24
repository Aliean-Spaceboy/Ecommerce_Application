package in.Ashokit.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import in.Ashokit.entity.Product_Entity;

public interface ProductRepo extends JpaRepository<Product_Entity, Integer>
{
	
	public List<Product_Entity>findByCategory_CategoryId(Integer categoryId);
	
	public List<Product_Entity> findByname(String productName);

}
