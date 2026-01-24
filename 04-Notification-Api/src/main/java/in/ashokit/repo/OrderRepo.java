package in.ashokit.repo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import in.ashokit.Entity.OrderEntity;

@Repository
public interface OrderRepo extends JpaRepository<OrderEntity, Integer> {

	public List<OrderEntity> findOrderByEmail(String Email);

	public OrderEntity findByRazorPayOrderId(String razorPayOrderId);

	public List<OrderEntity> findByDeleveryDate(LocalDate deleveryDate);
}
