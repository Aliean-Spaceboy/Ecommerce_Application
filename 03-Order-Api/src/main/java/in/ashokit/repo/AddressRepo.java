package in.ashokit.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import in.ashokit.entity.AddressEntity;

public interface AddressRepo extends JpaRepository<AddressEntity, Integer> {

}
