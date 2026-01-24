package in.ashokit.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import in.ashokit.Entity.AddressEntity;

@Repository
public interface AddressRepo extends JpaRepository<AddressEntity, Integer> {
	
	

}
