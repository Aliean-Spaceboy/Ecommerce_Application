package in.ashokit.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import in.ashokit.entity.CustomersEntity;

public interface CustomerRepo extends JpaRepository<CustomersEntity, Integer>{
   public CustomersEntity findByEmail(String custEmail);
}
