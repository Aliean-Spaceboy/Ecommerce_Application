package in.Ashokit.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import in.Ashokit.entity.CategoryEntity;

public interface CategoryRepo extends JpaRepository<CategoryEntity, Integer> {
 
}
