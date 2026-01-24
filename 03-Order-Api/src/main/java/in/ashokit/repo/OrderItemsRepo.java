package in.ashokit.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import in.ashokit.entity.OrderItem;

public interface OrderItemsRepo extends JpaRepository<OrderItem, Integer>{

}
