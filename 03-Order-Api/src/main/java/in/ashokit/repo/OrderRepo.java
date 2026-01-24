package in.ashokit.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import in.ashokit.entity.OrderEntity;

public interface OrderRepo extends JpaRepository<OrderEntity, Integer>
{
    public OrderEntity findByRazorPayOrderId(String razorPayOrderId);
    
    public List<OrderEntity> findByEmail(String email);
}
