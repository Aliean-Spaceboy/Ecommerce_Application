package in.ashokit.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import in.ashokit.Entity.OrderItems;

@Repository
public interface OrderItemsRepo extends JpaRepository<OrderItems, Integer> {

}
